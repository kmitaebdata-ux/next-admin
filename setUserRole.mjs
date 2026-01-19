// setUserRole.js

import admin from "firebase-admin";
import { readFileSync } from "fs";

// path to downloaded serviceAccountKey.json
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// pass UID + role from command line
const uid = process.argv[2];
const role = process.argv[3];

if (!uid || !role) {
  console.error("Usage: node setUserRole.js <uid> <admin|faculty|student>");
  process.exit(1);
}

async function assignRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Role assigned: uid=${uid}, role=${role}`);
    console.log("🚨 IMPORTANT: user must re-login to refresh token claims");
  } catch (err) {
    console.error("Error assigning role", err);
  }
}

assignRole();
