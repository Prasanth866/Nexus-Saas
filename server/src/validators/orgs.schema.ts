import { z } from "zod";

export const createOrgSchema = z.object({
    body: z.object({
        name: z.string()
            .min(2, "Organization name must be at least 2 characters long")
            .max(50, "Name cannot exceed 50 characters")
            .trim()
    })
});

export const updateOrgSchema = z.object({
    params: z.object({
        orgId: z.cuid2()
    }),
    body: z.object({
        name: z.string().min(2).max(50).trim().optional(),
        description: z.string().max(500).trim().optional(),
        logoUrl: z.url().or(z.literal("")).optional()
    }).refine(data => Object.keys(data).length > 0, {
        message: "You must provide at least one field to update"
    })
});

export const updateOrgSettingsSchema = z.object({
    params: z.object({
        orgId: z.cuid2()
    }),
    body: z.object({
        settings: z.record(z.string(), z.any(), { message: "Settings object payload is required" })
    })
});