const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "gxw3YZU1MaccHLgld0uHLiXOlIe2"; // FACULTY UID

admin
  .auth()
  .setCustomUserClaims(uid, { faculty: true })
  .then(() => {
    console.log(`✅ FACULTY role assigned to UID: ${uid}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
