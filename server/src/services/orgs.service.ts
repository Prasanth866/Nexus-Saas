import { OrgsRepo } from "../repositories/orgs.repo.js";
import { OrgRole, InvitationStatus } from "../generated/prisma/client.js";
import { supabaseClient } from "../config/supabase.js";
import crypto from "crypto";
import path from "path";

const BUCKET_NAME = process.env.BUCKET_NAME;

export class OrganizationService {
    private orgRepo = new OrgsRepo();

    async getUserOrganizations(userId: string) {
        return await this.orgRepo.listByUser(userId);
    }

    async createOrganization(name: string, userId: string) {
        const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const uniqueSlug = `${baseSlug}-${Math.floor(10000 + Math.random() * 90000)}`;

        return await this.orgRepo.create(name, uniqueSlug, userId);
    }

    async getOrganizationById(orgId: string) {
        const org = await this.orgRepo.findById(orgId);
        if (!org) throw new Error("Organization not found");
        return org;
    }

    async updateOrganization(orgId: string, data: any) {
        return await this.orgRepo.update(orgId, data);
    }

    async deleteOrganization(orgId: string) {
        return await this.orgRepo.delete(orgId);
    }

    async getSettings(orgId: string) {
        const result = await this.orgRepo.getSettings(orgId);
        return result?.settings || {};
    }

    async updateSettings(orgId: string, settings: Record<string, any>) {
        return await this.orgRepo.updateSettings(orgId, settings);
    }

    private async verifyAccess(orgId: string, userId: string, allowedRoles: OrgRole[]) {
        const member = await this.orgRepo.getMemberRole(orgId, userId);
        if (!member || !allowedRoles.includes(member.role)) {
            throw new Error("UNAUTHORIZED: Insufficient permissions to perform this action");
        }
        return member.role;
    }

    async getOrganizationMembers(orgId: string, requestorUserId: string) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER]);
        return await this.orgRepo.listMembers(orgId);
    }

    async inviteMember(orgId: string, requestorUserId: string, email: string, role: OrgRole) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN]);
        const targetEmail = email.toLowerCase();

        const activeMembers = await this.orgRepo.listMembers(orgId);
        const isAlreadyMember = activeMembers.some(
            (m) => m.user.email.toLowerCase() === targetEmail
        );
        if (isAlreadyMember) {
            throw new Error("BAD_REQUEST: User is already a member of this organization");
        }

        const invitationToken = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await this.orgRepo.createInvitation({
            email: targetEmail,
            organizationId: orgId,
            invitedById: requestorUserId,
            role,
            token: invitationToken,
            expiresAt,
        });

        return {
            message: "Invitation entry successfully staged.",
            invitationId: invitation.id,
            token: invitation.token
        };
    }

    async getOrganizationInvitations(orgId: string, requestorUserId: string, status?: InvitationStatus) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN]);
        return await this.orgRepo.listInvitations(orgId, status);
    }

    async updateMemberRole(orgId: string, requestorUserId: string, memberId: string, newRole: OrgRole) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN]);

        const targetMembership = await this.orgRepo.findMemberById(memberId);
        if (!targetMembership || targetMembership.organizationId !== orgId) {
            throw new Error("NOT_FOUND: Membership record not found in this organization");
        }

        if (targetMembership.userId === requestorUserId && targetMembership.role !== newRole) {
            const privilegedCount = await this.orgRepo.countPrivilegedMembers(orgId);
            if (privilegedCount <= 1) {
                throw new Error("BAD_REQUEST: Cannot change your role when you are the only Admin/Owner left");
            }
        }

        return await this.orgRepo.updateMemberRole(memberId, newRole);
    }

    async removeMember(orgId: string, requestorUserId: string, memberId: string) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN]);

        const targetMembership = await this.orgRepo.findMemberById(memberId);
        if (!targetMembership || targetMembership.organizationId !== orgId) {
            throw new Error("NOT_FOUND: Membership record not found in this organization");
        }

        const isSelfDeletion = targetMembership.userId === requestorUserId;
        const isTargetPrivileged = ([OrgRole.ADMIN, OrgRole.OWNER] as OrgRole[]).includes(targetMembership.role);
        if (isTargetPrivileged) {
            const privilegedCount = await this.orgRepo.countPrivilegedMembers(orgId);
            if (privilegedCount <= 1) {
                throw new Error(
                    isSelfDeletion
                        ? "BAD_REQUEST: You cannot delete yourself because you are the only Admin/Owner left."
                        : "BAD_REQUEST: Cannot remove this member. They are the last standing Admin/Owner."
                );
            }
        }

        return await this.orgRepo.removeMember(memberId);
    }

    async revokeInvitation(orgId: string, requestorUserId: string, invitationId: string) {
        await this.verifyAccess(orgId, requestorUserId, [OrgRole.OWNER, OrgRole.ADMIN]);

        return await this.orgRepo.updateInvitationStatus(invitationId, InvitationStatus.REVOKED);
    }

    async acceptInvitation(token: string, currentUserId: string) {
        const invitation = await this.orgRepo.findInvitationByToken(token);
        if (!invitation || invitation.status !== InvitationStatus.PENDING) {
            throw new Error("BAD_REQUEST: Invalid, revoked, or already processed invitation");
        }
        if (invitation.expiresAt < new Date()) {
            await this.orgRepo.updateInvitationStatus(invitation.id, InvitationStatus.EXPIRED);
            throw new Error("BAD_REQUEST: This invitation link has expired");
        }
        const currentUser = await this.orgRepo.findUserById(currentUserId);
        if (!currentUser || currentUser.email.toLowerCase() !== invitation.email.toLowerCase()) {
            throw new Error("UNAUTHORIZED: This invitation belongs to a different email address");
        }
        await this.orgRepo.addMember(invitation.organizationId, currentUserId, invitation.role);
        await this.orgRepo.updateInvitationStatus(invitation.id, InvitationStatus.ACCEPTED);
        return {
            message: "Successfully joined organization!",
            organizationId: invitation.organizationId
        };
    }

    async previewInvitation(token: string) {
        const invitation = await this.orgRepo.findInvitationByToken(token);
        if (!invitation || invitation.status !== InvitationStatus.PENDING) {
            throw new Error("NOT_FOUND: Invitation link is invalid, revoked, or already used");
        }

        if (invitation.expiresAt < new Date()) {
            await this.orgRepo.updateInvitationStatus(invitation.id, InvitationStatus.EXPIRED);
            throw new Error("BAD_REQUEST: This invitation link has expired");
        }

        const existingUser = await this.orgRepo.findUserByEmail(invitation.email);

        return {
            organizationName: invitation.organization.name,
            organizationLogo: invitation.organization.logoUrl,
            email: invitation.email,
            requiresRegistration: existingUser === null
        };
    }

    async generatePresignedLogoUrl(orgId: string, fileName: string) {
        const pureFileName = path.basename(fileName);
        const fileExtension = path.extname(pureFileName).replace('.', '').toLowerCase();
        const finalExtension = fileExtension || 'png';

        const filePath = `${orgId}/logo-${Date.now()}.${finalExtension}`;

        const { data, error } = await supabaseClient.storage
            .from(BUCKET_NAME)
            .createSignedUploadUrl(filePath, { upsert: false });

        if (error || !data) {
            console.error("[Supabase Org Logo Error] Attempted Path:", filePath, error);
            throw new Error(`Supabase Storage Error: ${error?.message || 'Failed to generate upload URL'}`);
        }

        const { data: publicUrlData } = supabaseClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        await this.orgRepo.updateLogo(orgId, publicUrlData.publicUrl);

        return {
            uploadUrl: data.signedUrl,
            filePath,
            logoUrl: publicUrlData.publicUrl,
        };
    }
}