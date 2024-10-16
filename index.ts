import express, { Application } from "express";
import dotenv from "dotenv";
import { ClerkExpressWithAuth, LooseAuthProp } from "@clerk/clerk-sdk-node";
var cors = require('cors');
import bodyParser from 'body-parser';

import { profileRouteGET } from "./controllers/profile/route";
import { reviewRoutePOST } from "./controllers/review/route";
import { reasonRouteGET } from "./controllers/reason/route";
import { postsForUserRouteGET } from "./controllers/post/route";

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
app.get("/reason", ClerkExpressWithAuth(), reasonRouteGET);
app.get("/post", ClerkExpressWithAuth(), postsForUserRouteGET);
app.post("/review", ClerkExpressWithAuth(), reviewRoutePOST);


// app.get("/collection/ofMemberAndNative", ClerkExpressWithAuth(), collectionsOfMemberAndNativeRouteGET);
// app.get("/collection/nativeNotAdded", ClerkExpressWithAuth(), nativeNotAddedRouteGET);
// app.get("/collection/:collectionId", ClerkExpressWithAuth(), collectionRouteGET);

// app.get("/collections", ClerkExpressWithAuth(), collectionsRouteGET);
// app.post("/collection", ClerkExpressWithAuth(), collectionRoutePOST);

// app.post("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRoutePOST);
// app.delete("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRouteDELETE);
// app.get("/collectionsOfMembers", ClerkExpressWithAuth(), collectionsOfMembersRouteGET);

// app.patch("/check", ClerkExpressWithAuth(), checkRoutePATCH);
// app.post("/check", ClerkExpressWithAuth(), checkRoutePOST);
// app.delete("/check", ClerkExpressWithAuth(), checkRouteDELETE);

// app.get("/nativeChecks/:collectionId", ClerkExpressWithAuth(), nativeCheckOfOneCollectionRouteGET);
// app.post("/nativeChecks", ClerkExpressWithAuth(), nativeCheckPOST);

// app.post("/upload", ClerkExpressWithAuth(), uploadRoutePOST);

app.use((req, res, next) => {
    res.status(404);
    next();
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});