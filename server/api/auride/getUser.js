import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const hostUrl = process.env.HOST_URL;

// init admin
if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

export default async function handler(req, res) {
    const origin = req.headers.origin;

    // handle preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        return res.status(204).end();
    }

    // allow only our frontend to access 
    if (origin !== hostUrl) {
        return res.status(403).json({ error: "Forbidden request." });
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // validate auth & data
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const decoded = await getAuth().verifyIdToken(token);
        const snapshot = await getDatabase().ref(`/users/drg419QZePS7qh3yFkwPxUcd9NB3`).get();

        if (!snapshot.exists()) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(snapshot.val());
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized request." });
    }
}