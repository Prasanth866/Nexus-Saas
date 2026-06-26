import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validateRequest = (schema: { parseAsync: (data: any) => Promise<any> }) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataToValidate: Record<string, any> = {};

            if (req.body && Object.keys(req.body).length > 0) dataToValidate.body = req.body;
            if (req.query && Object.keys(req.query).length > 0) dataToValidate.query = req.query;
            if (req.params && Object.keys(req.params).length > 0) dataToValidate.params = req.params;

            if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
                dataToValidate.body = req.body || {};
            }

            const parsed = await schema.parseAsync(dataToValidate);

            if (parsed.body) req.body = parsed.body;
            if (parsed.query) req.query = parsed.query;
            if (parsed.params) req.params = parsed.params;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    error: "Validation Failed",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                });
                return;
            }

            console.error("Validation Framework Crash Details:", error);

            res.status(500).json({ error: "Internal validation framework error" });
        }
    };
};