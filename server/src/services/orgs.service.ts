import { OrgsRepo } from "../repositories/orgs.repo.js";

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
}