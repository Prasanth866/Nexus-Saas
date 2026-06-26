import { Request, Response, NextFunction } from 'express';
import { auth } from "../config/firebase.js";

export interface AuthRequest extends Request {
    user?: {
        uid: string;
        email?: string;
    };
}

export const authenticateUser = async(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({error: 'Unauthorized: Missing or invalid token format'});
        return;
    }
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    try{
        const decoded = await auth.verifyIdToken(token);
        req.user = {
            uid: decoded.uid,
            email: decoded.email,
        }
        next();
    }catch(err){
        console.error("Firebase authentication error", err);
        res.status(401).json({error: "Unauthorized: invalid token"});
    }
}
