import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";

export const profileRouteGET = async (
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

        return res.json(profile.id);
    } catch (error) {
        return res.status(500).send("Internal Error");
    }
};