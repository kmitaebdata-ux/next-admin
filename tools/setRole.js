const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// 👇 PUT USER UID HERE
const uid = "1LXHe7kEZzflIoPMyLxfwQOO4f03";

// 👇 choose ONE: "admin" or "faculty"
const role = "admin";

const claims =
  role === "admin"
    ? { admin: true }
    : { faculty: true };

admin
  .auth()
  .setCustomUserClaims(uid, claims)
  .then(() => {
    console.log(`✅ ${role} role assigned to UID: ${uid}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error setting role:", err);
    process.exit(1);
  });
