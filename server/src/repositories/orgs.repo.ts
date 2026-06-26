import { prisma } from "../config/prisma.js";
import { OrgRole } from "../generated/prisma/client.js";

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
}