import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../../lib/initial-profile";
import { db } from "../../../lib/db";

export const collectionsNativeRouteGET = async (
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

        const params = req.params;

        if(!params.userId) {
            return res.status(400).send("Invalid User ID");
        }

        const collections = await db.collection.findMany({
            where: {
                CollectionsOfMembers: {
                    some: {
                        member: {
                            userId: params.userId
                        }
                    }
                }
            },
            include: {
                memberCollections: true
            }
        });

        return res.json(collections);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};