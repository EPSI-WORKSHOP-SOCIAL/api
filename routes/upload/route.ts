import { WithAuthProp } from "@clerk/clerk-sdk-node";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { initialMember } from "../../lib/initial-profile";
import { db } from "../../lib/db";

interface uploadRouteParamsProps {
    base64: string;
    extension: "jpg" | "png";
}

export const uploadRoutePOST = async (
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

        const body: uploadRouteParamsProps = req.body;

        if (!body.base64) {
            return res.status(400).send("Invalid base64 value");
        }

        if (!body.extension) {
            return res.status(400).send("Invalid extension value");
        }

        // const blurhash = await encodeImageToBlurhash(body.base64);

        // if (!blurhash) {
        //     return res.status(500).send("Error when generate blurhash");
        // }

        const base64Data = body.base64.replace(/^data:.*;base64,/, "");

        const fileName = uuidv4() + "." + body.extension;

        require("fs").writeFile('public/' + fileName, base64Data, 'base64', function (error: any) {
            if (error) {
                return res.status(500).send("Error when image upload");
            }
        });

        const image = await db.image.create({
            data: {
                path: fileName,
            }
        });

        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.json({
            fileName
        });
    } catch (error) {
        return res.status(500).send("Internal Error " + JSON.stringify(error));
    }
};