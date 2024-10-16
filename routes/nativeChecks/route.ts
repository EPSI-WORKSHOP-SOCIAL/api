import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

interface nativeCheckOfOneCollectionRouteParams {
    collectionId: string;
}

export const nativeCheckOfOneCollectionRouteGET = async (
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

        const nativeChecks = await db.nativeCheck.findMany({
            where: {
                collectionId: params.collectionId
            }
        });

        return res.json(nativeChecks);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};

interface nativeCheckPostParams {
    collection: {
        id: string;
    };
    penNumber: string;
}

export const nativeCheckPOST = async (
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

        const params: nativeCheckPostParams = req.body;

        if (!params.collection.id) {
            return res.status(400).send("Invalid Collection ID");
        }

        if (!params.penNumber) {
            return res.status(400).send("Invalid Pen Number");
        }

        const nativeCheck = await db.nativeCheck.create({
            data: {
                penNumber: params.penNumber,
                collectionId: params.collection.id
            }
        });

        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.json(nativeCheck);
    } catch (error) {
        return res.status(500).send("Internal Error"+JSON.stringify(error));
    }
};