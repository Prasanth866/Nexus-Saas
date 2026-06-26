import { prisma } from "../config/prisma.js";

export class UsersRepo {
    async findOrCreateByFirebaseUid(firebaseUid: string, email: string, name?: string) {
        return prisma.user.upsert({
            where: { firebaseUid },
            update: {},
            create:{
                firebaseUid,
                email,
                name: name || email.split("@")[0],
                settings: {},
            }
        });
    }

    async findByFirebaseUid(firebaseUid: string){
        return prisma.user.findUnique({
            where: {firebaseUid}
        });
    }

    async updateSettingsByFirebaseUid(firebaseUid: string, settings: Record<string, any>){
        return prisma.user.update({
            where: {firebaseUid : firebaseUid},
            data: { settings },
            select: { settings: true},
        });
    }

    async updateAvatarByFirebaseUid(firebaseUid: string, avatarUrl: string | null){
        return prisma.user.update({
        where: {firebaseUid : firebaseUid},
        data: { avatarUrl },
        });
    }
}