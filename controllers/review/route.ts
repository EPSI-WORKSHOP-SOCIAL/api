import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

interface routePostParamsProps {
    postId: string;
    answer: boolean;
    reasonId?: string;
    price?: number;
}

export const reviewRoutePOST = async (
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

        const body: routePostParamsProps = req.body;

        if (!body.postId) {
            return res.status(400).send("Invalid Post ID");
        }
        if (typeof body.answer === "undefined") {
            return res.status(400).send("Invalid Answer");
        }

        const review = await db.review.create({
            data: {
                answer: body.answer,
                postId: body.postId,
                userId: user.id,
                reasonId: body.reasonId,
                price: body.price,
            },
        });

        return res.json(review);
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Error");
    }
};