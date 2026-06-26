import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware.js';
import { usersService } from '../services/users.service.js';

const userService = new usersService();

export class UserController {
    async getMe(req: AuthRequest, res: Response): Promise<void> {
        try {
            const user = await userService.getProfile(req.user!.uid, req.user!.email ?? "");
            res.json(user);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const settings = await userService.getSettings(req.user!.uid);
            res.json({ settings });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateSettings(req: AuthRequest, res: Response): Promise<void> {
        try {
            const updated = await userService.updateSettings(req.user!.uid, req.body.settings || {});
            res.json(updated);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async getPresignedUrl(req: AuthRequest, res: Response): Promise<void> {
        try {
            const { fileName } = req.body;
            if (!fileName) {
                res.status(400).json({ error: "fileName is required inside payload body" });
                return;
            }
            const result = await userService.generatePresignedUploadUrl(req.user!.uid, fileName);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteAvatar(req: AuthRequest, res: Response): Promise<void> {
        try {
            await userService.deleteAvatar(req.user!.uid);
            res.status(200).json({ message: "Avatar deleted cleanly" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}