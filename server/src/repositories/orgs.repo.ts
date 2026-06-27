import { prisma } from "../config/prisma.js";
import { OrgRole, InvitationStatus, Prisma } from "../generated/prisma/client.js";

const invitationWithOrgValidator = Prisma.validator<Prisma.InvitationDefaultArgs>()({
    include: {
        organization: {
            select: {
                name: true,
                logoUrl: true
            }
        }
    }
});

export type InvitationWithOrg = Prisma.InvitationGetPayload<typeof invitationWithOrgValidator>;

export class OrgsRepo {
    async listByUser(userId: string) {
        return prisma.organization.findMany({
            where: {
                users: {
                    some: { userId }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async create(name: string, slug: string, creatorUserId: string) {
        return prisma.organization.create({
            data: {
                name,
                slug,
                users: {
                    create: {
                        userId: creatorUserId,
                        role: OrgRole.OWNER
                    }
                }
            }
        });
    }

    async findById(orgId: string) {
        return prisma.organization.findUnique({
            where: { id: orgId }
        });
    }

    async update(orgId: string, data: { name?: string; slug?: string; description?: string; logoUrl?: string }) {
        return prisma.organization.update({
            where: { id: orgId },
            data
        });
    }

    async delete(orgId: string) {
        return prisma.organization.delete({
            where: { id: orgId }
        });
    }

    async getSettings(orgId: string) {
        return prisma.organization.findUnique({
            where: { id: orgId },
            select: { settings: true }
        });
    }

    async updateSettings(orgId: string, settings: Record<string, any>) {
        return prisma.organization.update({
            where: { id: orgId },
            data: { settings },
            select: { settings: true }
        });
    }

    async getMemberRole(orgId: string, userId: string) {
        return prisma.organizationMember.findUnique({
            where: {
                organizationId_userId: { organizationId: orgId, userId }
            },
            select: { role: true }
        });
    }

    async listMembers(orgId: string) {
        return prisma.organizationMember.findMany({
            where: { organizationId: orgId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
            },
        });
    }

    async createInvitation(data: {
        email: string;
        organizationId: string;
        invitedById: string;
        role: OrgRole;
        token: string;
        expiresAt: Date;
    }) {
        return prisma.invitation.upsert({
            where: {
                organizationId_email: {
                    organizationId: data.organizationId,
                    email: data.email
                }
            },
            update: {
                role: data.role,
                token: data.token,
                expiresAt: data.expiresAt,
                invitedById: data.invitedById,
            },
            create: {
                organizationId: data.organizationId,
                email: data.email,
                role: data.role,
                token: data.token,
                expiresAt: data.expiresAt,
                invitedById: data.invitedById
            }
        });
    }

    async findUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
        });
    }

    async addMember(organizationId: string, userId: string, role: OrgRole) {
        return prisma.organizationMember.create({
            data: {
                organizationId,
                userId,
                role,
            },
        });
    }

    async findInvitationByToken(token: string): Promise<InvitationWithOrg | null> {
        return prisma.invitation.findUnique({
            where: { token },
            include: {
                organization: {
                    select: {
                        name: true,
                        logoUrl: true
                    }
                }
            }
        });
    }

    async findUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async updateMemberRole(memberId: string, role: OrgRole) {
        return prisma.organizationMember.update({
            where: { id: memberId },
            data: { role },
        });
    }

    async removeMember(memberId: string) {
        return prisma.organizationMember.delete({
            where: { id: memberId },
        });
    }

    async countPrivilegedMembers(orgId: string) {
        return prisma.organizationMember.count({
            where: {
                organizationId: orgId,
                role: {
                    in: [OrgRole.ADMIN, OrgRole.OWNER],
                },
            },
        });
    }

    async findMemberById(memberId: string) {
        return prisma.organizationMember.findUnique({
            where: { id: memberId },
        });
    }

    async updateInvitationStatus(invitationId: string, status: InvitationStatus) {
        return prisma.invitation.update({
            where: { id: invitationId },
            data: {
                status,
                acceptedAt: status === InvitationStatus.ACCEPTED ? new Date() : undefined
            }
        });
    }

    async listInvitations(orgId: string, status?: InvitationStatus) {
        return prisma.invitation.findMany({
            where: {
                organizationId: orgId,
                ...(status ? { status } : {})
            },
            include: {
                invitedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async updateLogo(orgId: string, logoUrl: string | null) {
        return prisma.organization.update({
            where: { id: orgId },
            data: { logoUrl }
        });
    }
}
