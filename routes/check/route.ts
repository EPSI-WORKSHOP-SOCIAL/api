import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

interface checkRoutePostParamsProps {
    collection: {
        id: string;
    };
    check: {
        penNumber: string;
    };
}

export const checkRoutePOST = async (
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

        const body: checkRoutePostParamsProps = req.body;

        if (!body.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }
        if (!body.check.penNumber) {
            return res.status(400).send("Invalid Pen Number");
        }

        const check = await db.check.findUnique({
            where: {
                memberId_collectionId_penNumber: {
                    memberId: profile.id,
                    collectionId: body.collection.id,
                    penNumber: body.check.penNumber
                }
            }
        });

        let _check;

        if (check) {
            _check = await db.check.update({
                where: {
                    memberId_collectionId_penNumber: {
                        memberId: profile.id,
                        collectionId: body.collection.id,
                        penNumber: body.check.penNumber
                    }
                },
                data: {
                    quantity: {
                        increment: 1
                    }
                }
            });
        } else {
            _check = await db.check.create({
                data: {
                    memberId: profile.id,
                    collectionId: body.collection.id,
                    penNumber: body.check.penNumber
                },
            });
        }

        return res.json(_check);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};

interface checkRoutePatchParamsProps {
    collection: {
        id: string;
    };
    check: {
        quantity?: any;
        penNumber: string;
        description?: string;
        hexaColor?: string;
        isEndOfLife?: boolean
    };
}

export const checkRoutePATCH = async (
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

        const body: checkRoutePatchParamsProps = req.body;

        if (!body.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }
        if (!body.check.penNumber) {
            return res.status(400).send("Invalid Pen Number");
        }

        const checks = await db.check.update({
            where: {
                memberId_collectionId_penNumber: {
                    penNumber: body.check.penNumber,
                    collectionId: body.collection.id,
                    memberId: profile.id,
                },
            },
            data: {
                quantity: body.check.quantity || undefined,
                description: body.check.description || undefined,
                hexaColor: body.check.hexaColor || undefined,
                isEndOfLife: body.check.isEndOfLife || undefined
            },
        });

        return res.json(checks);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};

interface checkRouteDeleteParamsProps {
    check: {
        penNumber: string;
    };
    collection: {
        id: string;
    };
}

export const checkRouteDELETE = async (
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

        const body: checkRouteDeleteParamsProps = req.body;

        if (!body.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }
        if (!body.check.penNumber) {
            return res.status(400).send("Invalid Pen Number");
        }

        const checks = await db.check.delete({
            where: {
                memberId_collectionId_penNumber: {
                    penNumber: body.check.penNumber,
                    collectionId: body.collection.id,
                    memberId: profile.id,
                }
            },
        });

        return res.json(checks);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};
