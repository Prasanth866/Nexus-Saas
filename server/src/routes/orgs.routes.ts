import { Router } from "express";
import { OrganizationController } from "../controllers/orgs.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { requireOrgMembership } from "../middleware/orgs.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { OrgRole } from "../generated/prisma/client.js";
import {
    createOrgSchema,
    updateOrgSchema,
    updateOrgSettingsSchema,
    inviteMemberSchema,
    updateMemberRoleSchema
} from "../validators/orgs.schema.js";

const router = Router();
const controller = new OrganizationController();

router.get(
    "/invitations/preview",
    controller.previewInvitation.bind(controller)
);

router.use(authenticateUser);

router.post(
    "/invitations/accept",
    controller.acceptInvitation.bind(controller)
);

router.get(
    "/orgs",
    controller.listMyOrgs.bind(controller)
);

router.post(
    "/orgs",
    validateRequest(createOrgSchema),
    controller.createOrg.bind(controller)
);

router.get(
    "/orgs/:orgId",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER, OrgRole.GUEST]),
    controller.getOrg.bind(controller)
);

router.patch(
    "/orgs/:orgId",
    validateRequest(updateOrgSchema),
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.updateOrg.bind(controller)
);

router.delete(
    "/orgs/:orgId",
    requireOrgMembership([OrgRole.OWNER]),
    controller.deleteOrg.bind(controller)
);

router.get(
    "/orgs/:orgId/settings",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.getSettings.bind(controller)
);

router.patch(
    "/orgs/:orgId/settings",
    validateRequest(updateOrgSettingsSchema),
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.updateSettings.bind(controller)
);

router.get(
    "/orgs/:orgId/members",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN, OrgRole.MEMBER]),
    controller.getMembers.bind(controller)
);

router.post(
    "/orgs/:orgId/members/invite",
    validateRequest(inviteMemberSchema),
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.inviteMember.bind(controller)
);

router.get(
    "/orgs/:orgId/invitations",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.getInvitations.bind(controller)
);

router.post(
    "/orgs/:orgId/invitations/:invitationId/revoke",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.revokeInvitation.bind(controller)
);

router.patch(
    "/orgs/:orgId/members/:memberId",
    validateRequest(updateMemberRoleSchema),
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.updateMemberRole.bind(controller)
);

router.delete(
    "/orgs/:orgId/members/:memberId",
    requireOrgMembership([OrgRole.OWNER, OrgRole.ADMIN]),
    controller.removeMember.bind(controller)
);

export default router;