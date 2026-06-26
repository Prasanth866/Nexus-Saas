import { Router } from "express";
import { OrganizationController } from "../controllers/orgs.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { requireOrgMembership } from "../middleware/orgs.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { OrgRole } from "../generated/prisma/client.js";
import {
    createOrgSchema,
    updateOrgSchema,
    updateOrgSettingsSchema
} from "../validators/orgs.schema.js";

const router = Router();
const controller = new OrganizationController();

router.use(authenticateUser);

router.get(
    "/orgs",
    (req, res) => controller.listMyOrgs(req as any, res)
);

router.post(
    "/orgs",
    validateRequest(createOrgSchema),
    (req, res) => controller.createOrg(req as any, res)
);

router.get(
    "/orgs/:orgId",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER, OrgRole.GUEST]),
    (req, res) => controller.getOrg(req as any, res)
);

router.patch(
    "/orgs/:orgId",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    validateRequest(updateOrgSchema),
    (req, res) => controller.updateOrg(req as any, res)
);

router.delete(
    "/orgs/:orgId",
    requireOrgMembership([OrgRole.OWNER]),
    (req, res) => controller.deleteOrg(req as any, res)
);

router.get(
    "/orgs/:orgId/settings",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    (req, res) => controller.getSettings(req as any, res)
);

router.patch(
    "/orgs/:orgId/settings",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    validateRequest(updateOrgSettingsSchema),
    (req, res) => controller.updateSettings(req as any, res)
);

export default router;