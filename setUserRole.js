// setUserRole.js
// run: node setUserRole.js <UID> <role>

const admin = require("firebase-admin");
const fs = require("fs");

// load credential file
const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = process.argv[2];
const role = process.argv[3];

if (!uid || !role) {
  console.log("❌ Usage: node setUserRole.js <UID> <admin|faculty|student>");
  process.exit(1);
}

async function assign() {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });

    console.log(`✔ role '${role}' assigned to user ${uid}`);
    console.log(`⚠ Ask user to logout/login to refresh token`);

  } catch (e) {
    console.error("❌ Failed:", e);
  }
}

assign();
