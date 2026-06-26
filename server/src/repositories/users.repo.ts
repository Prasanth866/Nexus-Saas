import { prisma } from "../config/prisma.js";

export class UsersRepo {
    async findOrCreate(id: string, email: string, name?: string) {
        return prisma.user.upsert({
            where: { id },
            update: {},
            create: {
                id,
                email,
                name: name || email.split("@")[0],
                settings: {},
            }
        });
    }

    async findById(id: string) {
        return prisma.user.findUnique({
            where: { id },
        });
    }

    async updateSettings(id: string, settings: Record<string, any> ) {
        return prisma.user.update({
            where: { id },
            data: { settings },
            select: { settings: true },
        });
    }

    async updateAvatar(id: string, avatarUrl: string | null) {
        return prisma.user.update({
            where: { id },
            data: { avatarUrl },
        });
    }
}