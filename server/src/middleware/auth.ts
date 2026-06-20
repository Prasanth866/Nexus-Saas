import { NextFunction, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { auth } from '../config/firebase.js';

export async function verifyToken(
    req: Request,
    res: Response,
    next: NextFunction
){
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith('Bearer ')){
            return res.status(401).json({
                message:"Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = await auth.verifyIdToken(token);

        let user = await prisma.user.findUnique({
            where:{
                firebaseUid:decoded.uid,
            }
        });

        if(!user){
            if(!decoded.email){
                return res.status(400).json({message:"Require email address"});
            }
            const org = await prisma.organization.create({
                data:{
                    name: decoded.name ? `${decoded.name}'s Organization` : "Default Organization",
                }
            })
            user = await prisma.user.create({
                data:{
                    firebaseUid: decoded.uid,
                    email: decoded.email!,
                    name: decoded.name ?? "New User",
                    role: "OWNER",
                    organization: {
                        connect:{
                            id: org.id,
                        }
                    },
                }
            });
        }

        req.user = user;

        next();
    }catch(e){
        return res.status(401).json({
            message:"Invalid token",
        });
    }
}
