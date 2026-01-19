// setAdminClaim.js
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccount.json");  // <- your admin SDK key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setAdmin() {
  const uid = "Y3kXSqBu2NYxaRmBg4t0EpSz6ld2";

  await admin.auth().setCustomUserClaims(uid, {
    admin: true,
    department: "EXAM"
  });

  console.log("✔ Admin claim added to user:", uid);
  console.log("⚠️ IMPORTANT: User must log out and log back in to refresh token.");
}

setAdmin();
