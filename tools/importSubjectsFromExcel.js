import admin from "firebase-admin";
import xlsx from "xlsx";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const workbook = xlsx.readFile("subjects.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = xlsx.utils.sheet_to_json(sheet);

(async () => {
  for (const r of rows) {
    const ref = db.collection("subjects").doc(r["Subject Code"]);

    await ref.set({
      code: r["Subject Code"],
      name: r["Subject Name"],
      regulation: r["Regulation"],
      branch: r["Branch"],
      year: Number(r["Year"]),
      semester: Number(r["Semester"]),
      locked: false
    });
  }

  console.log("✅ Subjects imported successfully");
})();
