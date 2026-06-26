import path from 'path';
import { UsersRepo } from "../repositories/users.repo.js";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = process.env.BUCKET_NAME!;

export class usersService{
    private userRepo = new UsersRepo();
    async getProfile(firebaseUid: string, email: string) {
        return await this.userRepo.findOrCreateByFirebaseUid(firebaseUid, email);
    }

    async getSettings(firebaseUid: string) {
        const user = await this.userRepo.findByFirebaseUid(firebaseUid);
        return user?.settings || {};
    }

    async updateSettings(firebaseUid: string, settings: Record<string, any>) {
        return await this.userRepo.updateSettingsByFirebaseUid(firebaseUid, settings);
    }

    async generatePresignedUploadUrl(firebaseUid: string, fileName: string) {
        const pureFileName = path.basename(fileName);
        const fileExtension = path.extname(pureFileName).replace('.', '').toLowerCase();
        const finalExtension = fileExtension || 'jpg';
        const filePath = `${firebaseUid}/avatar-${Date.now()}.${finalExtension}`;
        const { data, error } = await supabaseClient.storage
            .from(BUCKET_NAME)
            .createSignedUploadUrl(filePath, { upsert: false });
        if (error || !data) {
            console.error("[Supabase Error Diagnostic] Attempted Path:", filePath, error);
            throw new Error(`Supabase Storage Error: ${error?.message || 'Failed to generate upload URL'}`);
        }
        const { data: publicUrlData } = supabaseClient.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
        await this.userRepo.updateAvatarByFirebaseUid(firebaseUid, publicUrlData.publicUrl);
        return {
            uploadUrl: data.signedUrl,
            filePath,
            avatarUrl: publicUrlData.publicUrl,
        };
    }

    async deleteAvatar(firebaseUid: string) {
        const user = await this.userRepo.findByFirebaseUid(firebaseUid);
        if (!user || !user.avatarUrl) {
            return ;
        }
        const urlPaths = user.avatarUrl.split(`${BUCKET_NAME}/`);
        if (urlPaths.length === 2) {
            const filePath = urlPaths[1];
            await supabaseClient.storage.from(BUCKET_NAME).remove([filePath]);
        }
        await this.userRepo.updateAvatarByFirebaseUid(firebaseUid, null);
    }
}
