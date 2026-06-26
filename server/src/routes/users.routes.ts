import { Router } from "express";
import { UserController } from "../controllers/users.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();
const userController = new UserController();

router.use(authenticateUser);

router.get("/users/me", (req, res) => userController.getMe(req, res));
router.get("/users/me/settings", (req, res) => userController.getSettings(req, res));
router.patch("/users/me/settings", (req, res) => userController.updateSettings(req, res));
router.post("/users/me/avatar/presign", (req, res) => userController.getPresignedUrl(req, res));
router.delete("/users/me/avatar", (req, res) => userController.deleteAvatar(req, res));

export default router;