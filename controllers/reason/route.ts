import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

export const reasonRouteGET = async (
    req: WithAuthProp<Request>,
    res: Response
) => {
    try {
        const clerkUserId = req.auth.userId;

        if (!clerkUserId) {
            return res.status(401).send("Unauthorized");
        }

        const user = await initialMember(clerkUserId);

        if (!user) {
            return res.status(401).send("Unauthorized");
        }

        const reasons = await db.reason.findMany();

        return res.json(reasons);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};