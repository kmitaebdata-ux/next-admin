/**
 * Bulk Student Importer (FINAL ESM VERSION)
 * Works with Node 18–24
 * No csv-parser needed (uses csv-parse/sync)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import JSZip from "jszip";
import admin from "firebase-admin";

// ------------------------------------------------------
// FIX __dirname for ES Modules
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------
// VALIDATE INPUT
// ------------------------------------------------------
if (process.argv.length < 4) {
  console.log("\n❌ Usage:");
  console.log("node tools/import-students.js students.csv photos.zip\n");
  process.exit(1);
}

const CSV_PATH = process.argv[2];
const ZIP_PATH = process.argv[3];

if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ CSV not found: ${CSV_PATH}`);
  process.exit(1);
}

if (!fs.existsSync(ZIP_PATH)) {
  console.error(`❌ ZIP file not found: ${ZIP_PATH}`);
  process.exit(1);
}

// ------------------------------------------------------
// INITIALIZE FIREBASE ADMIN
// ------------------------------------------------------
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("\n❌ ERROR: Missing serviceAccountKey.json in /tools/");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: "kmit-marks-portal-9db76.appspot.com",  // <-- correct bucket
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

console.log("\n🔥 Firebase Admin initialized");
console.log("Using bucket:", bucket.name);

// ------------------------------------------------------
// READ CSV (sync + error-free)
// ------------------------------------------------------
console.log("\n📥 Reading CSV...");

const csvBuffer = fs.readFileSync(CSV_PATH);
const students = parse(csvBuffer, {
  columns: true,
  skip_empty_lines: true,
});

console.log(`✔ Loaded ${students.length} rows`);

// ------------------------------------------------------
// READ ZIP
// ------------------------------------------------------
console.log("\n📦 Reading ZIP...");

const zipBuffer = fs.readFileSync(ZIP_PATH);
const zip = await JSZip.loadAsync(zipBuffer);

const zipFiles = Object.keys(zip.files)
  .filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
  .map((f) => f.toLowerCase());

console.log(`✔ ZIP contains ${zipFiles.length} images\n`);

// ------------------------------------------------------
// IMPORT STUDENTS
// ------------------------------------------------------
console.log("🚀 Starting import...\n");

let success = 0;
let failed = 0;

for (const s of students) {
  try {
    const roll = s.roll.trim();
    const imgName = `${roll}.jpg`;
    const lowerImg = imgName.toLowerCase();

    let photoURL = "";

    // Upload photo IF it exists
    if (zipFiles.includes(lowerImg)) {
      const imgFile = zip.files[lowerImg];
      const buffer = await imgFile.async("nodebuffer");

      const storagePath = `students/photos/${imgName}`;
      const file = bucket.file(storagePath);

      await file.save(buffer, {
        metadata: { contentType: "image/jpeg" },
        public: true,
      });

      photoURL = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;
    } else {
      console.log(`⚠️ Photo missing for ${roll}`);
    }

    // Save to Firestore
    await db.collection("students").doc(roll).set(
      {
        roll,
        student_name: s.student_name || "",
        year: s.year || "",
        semester: s.semester || "",
        branch: s.branch || "",
        branchCode: s.branchCode || "",
        section: s.section || "",
        admissionType: s.admissionType || "",
        admissionAy: s.admissionAy || "",
        currentAy: s.currentAy || "",
        photoURL,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    console.log(`✔ Imported: ${roll}`);
    success++;
  } catch (e) {
    console.error(`❌ Failed: ${s.roll}`, e.message);
    failed++;
  }
}

// ------------------------------------------------------
// SUMMARY
// ------------------------------------------------------
console.log("\n==============================");
console.log("🎉 IMPORT COMPLETED");
console.log("==============================");
console.log(`✔ Success: ${success}`);
console.log(`❌ Failed:  ${failed}`);
console.log("==============================\n");

process.exit(0);
