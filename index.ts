import express, { Application, Response } from "express";
import dotenv from "dotenv";
import { ClerkExpressWithAuth, LooseAuthProp } from "@clerk/clerk-sdk-node";
import { db } from "./lib/db";
var cors = require('cors');
import bodyParser from 'body-parser';

import { collectionsOfMemberAndNativeRouteGET } from "./routes/collection/ofMemberAndNative/route";
import { profileRouteGET } from "./routes/profile/route";
import { collectionsOfMembersRouteDELETE, collectionsOfMembersRouteGET, collectionsOfMembersRoutePOST } from "./routes/collectionsOfMembers/route";
import { checkRouteDELETE, checkRoutePATCH, checkRoutePOST } from "./routes/check/route";
import { nativeNotAddedRouteGET } from "./routes/collection/nativeNotAdded/route";
import { collectionRouteGET, collectionRoutePOST } from "./routes/collection/route";
import { collectionsRouteGET } from "./routes/collections/route";
import { uploadRoutePOST } from "./routes/upload/route";
import { nativeCheckOfOneCollectionRouteGET, nativeCheckPOST } from "./routes/nativeChecks/route";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

declare global {
    namespace Express {
        interface Request extends LooseAuthProp { }
    }
}

app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use("/static", express.static("public"));

app.get("/profile", ClerkExpressWithAuth(), profileRouteGET);

app.get("/collection/ofMemberAndNative", ClerkExpressWithAuth(), collectionsOfMemberAndNativeRouteGET);
app.get("/collection/nativeNotAdded", ClerkExpressWithAuth(), nativeNotAddedRouteGET);
app.get("/collection/:collectionId", ClerkExpressWithAuth(), collectionRouteGET);

app.get("/collections", ClerkExpressWithAuth(), collectionsRouteGET);
app.post("/collection", ClerkExpressWithAuth(), collectionRoutePOST);

app.post("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRoutePOST);
app.delete("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRouteDELETE);
app.get("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRouteGET);

app.patch("/check", ClerkExpressWithAuth(), checkRoutePATCH);
app.post("/check", ClerkExpressWithAuth(), checkRoutePOST);
app.delete("/check", ClerkExpressWithAuth(), checkRouteDELETE);

app.get("/nativeChecks/:collectionId", ClerkExpressWithAuth(), nativeCheckOfOneCollectionRouteGET);
app.post("/nativeChecks", ClerkExpressWithAuth(), nativeCheckPOST);

app.post("/upload", ClerkExpressWithAuth(), uploadRoutePOST);

app.get("/collection/new/:userId", async (req, res: Response) => {
    try {
        const nativeCollection = await db.memberCollection.create({
            data: {
                collection: {
                    create: {
                        name: "Pen 68 Brush",
                        imagePath: "https://m.media-amazon.com/images/I/81TzmBB2XuL.jpg",
                        brand: "Stabilo",
                        hasNoNativeChecks: false
                    },
                },
                member: {
                    connect: {
                        userId: req.params.userId,
                    },
                },
            },
            include: {
                collection: true,
            },
        });

        res.json(nativeCollection);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Error", context: error });
    }
});

app.use((req, res, next) => {
    res.status(404);
    next();
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
