import { Request, Response } from "express";
import { OrgAuthRequest } from "../middleware/orgs.middleware.js";
import { OrganizationService } from "../services/orgs.service.js";
import { OrgRole, InvitationStatus } from "../generated/prisma/client.js";

const orgService = new OrganizationService();

export class OrganizationController {

    private handleError(res: Response, error: any) {
        const message = error.message || "Internal server error";

        if (message.startsWith("UNAUTHORIZED")) {
            return res.status(403).json({ error: message });
        }
        if (message.startsWith("NOT_FOUND")) {
            return res.status(404).json({ error: message });
        }
        if (message.startsWith("BAD_REQUEST")) {
            return res.status(400).json({ error: message });
        }

        return res.status(500).json({ error: message });
    }

    async listMyOrgs(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized: Missing user identity context" });
                return;
            }
            const orgs = await orgService.getUserOrganizations(userId);
            res.json(orgs);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async createOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            if (!name) {
                res.status(400).json({ error: "Field 'name' is required inside payload body" });
                return;
            }

            const userId = req.user?.uid;
            if (!userId) {
                res.status(401).json({ error: "Unauthorized: Incomplete authentication context on token" });
                return;
            }

            const newOrg = await orgService.createOrganization(name, userId);
            res.status(201).json(newOrg);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async getOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const org = await orgService.getOrganizationById(orgId);
            res.json(org);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async updateOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const updated = await orgService.updateOrganization(orgId, req.body);
            res.json(updated);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async deleteOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            await orgService.deleteOrganization(orgId);
            res.status(200).json({ message: "Organization deleted completely" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async getSettings(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const settings = await orgService.getSettings(orgId);
            res.json({ settings });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async updateSettings(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const settingsData = req.body.settings !== undefined ? req.body.settings : req.body;
            const updated = await orgService.updateSettings(orgId, settingsData);
            res.json(updated);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async getMembers(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            const members = await orgService.getOrganizationMembers(orgId, requestorUserId);
            res.json(members);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async inviteMember(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const { email, role } = req.body as { email: string; role: OrgRole };
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            if (!email || !role) {
                res.status(400).json({ error: "Fields 'email' and 'role' are required in request body" });
                return;
            }

            const result = await orgService.inviteMember(orgId, requestorUserId, email, role);
            res.status(201).json(result);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async getInvitations(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const status = req.query.status as InvitationStatus | undefined;
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            const invitations = await orgService.getOrganizationInvitations(orgId, requestorUserId, status);
            res.json(invitations);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async revokeInvitation(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId, invitationId } = req.params as { orgId: string; invitationId: string };
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            await orgService.revokeInvitation(orgId, requestorUserId, invitationId);

            res.status(200).json({ message: "Invitation has been successfully revoked." });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async updateMemberRole(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId, memberId } = req.params as { orgId: string; memberId: string };
            const { role } = req.body as { role: OrgRole };
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            if (!role) {
                res.status(400).json({ error: "Field 'role' is required in request body" });
                return;
            }

            const updatedMember = await orgService.updateMemberRole(orgId, requestorUserId, memberId, role);
            res.json(updatedMember);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async removeMember(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId, memberId } = req.params as { orgId: string; memberId: string };
            const requestorUserId = req.user?.uid;

            if (!requestorUserId) {
                res.status(401).json({ error: "Unauthorized: Missing user authentication context" });
                return;
            }

            await orgService.removeMember(orgId, requestorUserId, memberId);
            res.status(200).json({ message: "Member removed from organization successfully" });
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async acceptInvitation(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { token } = req.body as { token: string };
            const currentUserId = req.user?.uid;

            if (!currentUserId) {
                res.status(401).json({ error: "Unauthorized: Missing identity context" });
                return;
            }

            if (!token) {
                res.status(400).json({ error: "Field 'token' is required in request body" });
                return;
            }

            const result = await orgService.acceptInvitation(token, currentUserId);
            res.status(200).json(result);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }

    async previewInvitation(req: Request, res: Response): Promise<void> {
        try {
            const { token } = req.query as { token: string };

            if (!token) {
                res.status(400).json({ error: "Query parameter 'token' is required" });
                return;
            }

            const previewData = await orgService.previewInvitation(token);
            res.json(previewData);
        } catch (error: any) {
            this.handleError(res, error);
        }
    }
}