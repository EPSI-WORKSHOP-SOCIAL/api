import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";

export const profileRouteGET = async (
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

        return res.json(user);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};