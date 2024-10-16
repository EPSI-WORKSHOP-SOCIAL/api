import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { initialMember } from "../../../lib/initial-profile";
import { db } from "../../../lib/db";
import { Request, Response } from "express";

export const nativeNotAddedRouteGET = async (
    req: WithAuthProp<Request>,
    res: Response
) => {
    try {
        const userId = req.auth.userId;

        if (!userId) {
            return res.status(401).send("Unauthorized");
        }

        const profile = await initialMember(userId);

        if (!profile) {
            return res.status(401).send("Unauthorized");
        }

        const collections = await db.nativeCollection.findMany({
            where: {
                collection: {
                    CollectionsOfMembers: {
                        none: {
                            memberId: profile.id
                        }
                    }
                }
            },
            select: {
                collection: true
            }
        });        

        return res.json(collections);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};