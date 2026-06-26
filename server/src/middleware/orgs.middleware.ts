import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";
import { OrgsRepo } from "../repositories/orgs.repo.js";
import { OrgRole } from "../generated/prisma/client.js";

const orgRepo = new OrgsRepo();

export interface OrgAuthRequest extends AuthRequest {
    orgRole?: OrgRole;
}

export const requireOrgMembership = (allowedRoles: OrgRole[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const { orgId } = req.params;
        const internalUserId = req.user?.uid;

        if (!orgId || !internalUserId) {
            res.status(400).json({ error: "Missing organization context or user mapping context" });
            return;
        }

        try {
            const membership = await orgRepo.getMemberRole(orgId as string, internalUserId);
            if (!membership || !allowedRoles.includes(membership.role)) {
                res.status(403).json({ error: "Forbidden: Insufficient permissions for this organization" });
                return;
            }

            (req as any).orgRole = membership.role;
            next();
        } catch (error) {
            res.status(500).json({ error: "Internal authorization verification failure" });
        }
    };
};