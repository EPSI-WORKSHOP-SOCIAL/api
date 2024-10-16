import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

interface collectionsOfMembersRouteParamsProps {
    collection: {
        id: string
    }
}

export const collectionsOfMembersRoutePOST = async (
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

        const body: collectionsOfMembersRouteParamsProps = req.body;

        if(!body.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }

        const CollectionsOfMembers = await db.collection.findFirst({
            where: {
                CollectionsOfMembers: {
                    some: {
                        memberId: profile.id,
                        collection: {
                            id: body.collection.id
                        }
                    }
                }
            }
        });

        if(CollectionsOfMembers) {
            return res.status(400).send("Member ID already add Collection");
        }

        const collection = await db.collection.update({
            where: {
                id: body.collection.id
            },
            data: {
                CollectionsOfMembers: {
                    create: {
                        memberId: profile.id
                    }
                }
            }
        });

        return res.json(collection);
    } catch (error) {
        console.log(error);        
        return res.status(500).send("Internal Error");
    }
};

export const collectionsOfMembersRouteGET = async (
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

        const collections = await db.collection.findMany({
            where: {
                CollectionsOfMembers: {
                    some: {
                        member: {
                            id: profile.id
                        }
                    }
                }
            },
            include: {
                checks: true,
                nativeChecks: true
            }
        });

        return res.json(collections);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};

export const collectionsOfMembersRouteDELETE = async (
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

        const body: collectionsOfMembersRouteParamsProps = req.body;

        if(!body.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }

        const collection = await db.collectionsOfMembers.deleteMany({
            where: {
                collectionId: body.collection.id,
                memberId: profile.id,
            },
        });

        return res.json(collection);
    } catch (error) {
        console.log(error);        
        return res.status(500).send("Internal Error");
    }
};
