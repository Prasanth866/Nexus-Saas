import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validateRequest = (schema: { parseAsync: (data: any) => Promise<any> }) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataToValidate: Record<string, any> = {
                body: req.body || {},
                query: req.query || {},
                params: req.params || {}
            };

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