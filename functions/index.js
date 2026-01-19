const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setUserRole = functions.https.onCall(
  async (data, context) => {
    // 🔐 Allow only ADMIN
    if (!context.auth || context.auth.token.admin !== true) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "Only admin can assign roles"
      );
    }

    const { uid, role } = data;

    if (!uid || !role) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "UID and role are required"
      );
    }

    let claims = {};
    if (role === "admin") claims = { admin: true };
    if (role === "faculty") claims = { faculty: true };

    await admin.auth().setCustomUserClaims(uid, claims);

    return { success: true };
  }
);
