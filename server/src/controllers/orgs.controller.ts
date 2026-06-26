import { Response } from "express";
import { OrgAuthRequest } from "../middleware/orgs.middleware.js";
import { OrganizationService } from "../services/orgs.service.js";

const orgService = new OrganizationService();

export class OrganizationController {
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
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    }

    async getOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const org = await orgService.getOrganizationById(orgId);
            res.json(org);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    async updateOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const updated = await orgService.updateOrganization(orgId, req.body);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteOrg(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            await orgService.deleteOrganization(orgId);
            res.status(200).json({ message: "Organization deleted completely" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSettings(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const settings = await orgService.getSettings(orgId);
            res.json({ settings });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSettings(req: OrgAuthRequest, res: Response): Promise<void> {
        try {
            const { orgId } = req.params as { orgId: string };
            const settingsData = req.body.settings !== undefined ? req.body.settings : req.body;
            const updated = await orgService.updateSettings(orgId, settingsData);
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}