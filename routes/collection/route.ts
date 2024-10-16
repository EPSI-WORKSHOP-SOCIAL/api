import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

export const collectionsRouteGET = async (
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

        if (!params.userId) {
            return res.status(400).send("Invalid User ID");
        }

        const collections = await db.collection.findMany({
            where: {
                CollectionsOfMembers: {
                    some: {
                        member: {
                            userId: params.userId,
                        },
                    },
                },
            },
            include: {
                memberCollections: true,
            },
        });

        return res.json(collections);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};

export const collectionRouteGET = async (
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

        if (!params.collectionId) {
            return res.status(400).send("Invalid Collection ID");
        }

        const collection = await db.collection.findUnique({
            where: {
                id: params.collectionId,
            },
            select: {
                _count: {
                    select: {
                        CollectionsOfMembers: {
                            where: {
                                memberId: profile.id
                            }
                        }
                    },
                },
                checks: {
                    where: {
                        memberId: profile.id,
                    }
                },
                nativeChecks: true,
                id: true,
                imagePath: true,
                name: true,
                brand: true,
                hasNoNativeChecks: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return res.json(collection);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};

interface collectionRoutePostParams {
    name: string;
    brand: string;
    imagePath: string;
    hasNoNativeChecks: boolean;
}

export const collectionRoutePOST = async (
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

        const body: collectionRoutePostParams = req.body;

        if (!body.name) {
            return res.status(400).send("Invalid Name");
        }

        if (!body.brand) {
            return res.status(400).send("Invalid Brand");
        }

        if (!body.imagePath) {
            return res.status(400).send("Invalid Image Path");
        }

        if (typeof body.hasNoNativeChecks == "undefined") {
            return res.status(400).send("Invalid hasNoNativeChecks");
        }

        const nativeCollection = await db.nativeCollection.create({
            data: {
                collection: {
                    create: {
                        name: body.name,
                        brand:  body.brand,
                        imagePath: body.imagePath,
                        hasNoNativeChecks: body.hasNoNativeChecks
                    }
                },
            }
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json(nativeCollection);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};
