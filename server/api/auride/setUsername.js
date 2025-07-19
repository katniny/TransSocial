import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const hostUrl = process.env.HOST_URL;

// keep track of rate limit
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 1 * 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 1; // max 1 requests

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

// read body
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => {
            data += chunk;
        });
        req.on("end", () => {
            resolve(data);
        });
        req.on("error", err => {
            reject(err);
        });
    });
}

// handler
export default async function handler(req, res) {
    const origin = req.headers.origin;

    // handle rate limit
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.connection.remoteAddress;
    const now = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, startTime: now };

    if (now - userData.startTime < RATE_LIMIT_WINDOW) {
        if (userData.count >= RATE_LIMIT_MAX) {
            return res.status(429).json({ error: "Too many requests. Please slow down." });
        } else {
            userData.count += 1;
        }
    } else {
        // reset window
        userData.count = 1;
        userData.startTime = now;
    }

    rateLimitMap.set(ip, userData);

    // handle preflight
    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", origin || "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
        return res.status(204).end();
    }

    // allow only our frontend to access 
    if (origin !== hostUrl) {
        return res.status(403).json({ error: "Forbidden request." });
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

    // validate auth & data
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ error: "Missing token" });
    }

    try {
        const rawBody = await getRawBody(req);
        const body = JSON.parse(rawBody);
        const { requestedUsername } = body;

        const decoded = await getAuth().verifyIdToken(token);
        const uid = decoded.uid;
        const userRef = getDatabase().ref(`/users/${uid}`);

        // check if the username is taken
        const checkUsernameTaken = await getDatabase().ref(`/taken-usernames/${requestedUsername}`).get();

        if (checkUsernameTaken.exists()) {
            return res.status(403).json({ error: "This username is already taken." });
        }

        // check if they have a current username
        // if they do, mark it as untaken
        const hasUsername = await getDatabase().ref(`/users/${uid}/username`).get();
        if (hasUsername.exists()) {
            await getDatabase().ref(`/taken-usernames/${hasUsername.val()}`).update({
                user: null
            });
        }

        // then, write their requested username
        await userRef.update({
            username: requestedUsername
        });

        // then, make sure that the username gets taken in the db
        await getDatabase().ref(`/taken-usernames/${requestedUsername}`).update({
            user: uid
        });

        return res.status(200).json({ message: "Successfully set the users username." });
    } catch (err) {
        console.log(err);
        return res.status(401).json({ error: "Unauthorized request." });
    }
}