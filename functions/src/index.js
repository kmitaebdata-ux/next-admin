import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onObjectFinalized } from "firebase-functions/v2/storage";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import admin from "firebase-admin";
import { parse } from "csv-parse/sync";
import { PDFDocument, StandardFonts } from "pdf-lib";

admin.initializeApp();
const db = getFirestore();

// ==========  LOCK EXAM  ==========
export const lockExam = onCall(async (req) => {
  const { examId } = req.data;

  if (req.auth.token.role !== "admin")
    throw new HttpsError("permission-denied", "Admins only");

  await db.collection("examLocks").doc(examId).set({
    locked: true,
    lockedBy: req.auth.uid,
    lockedAt: Timestamp.now(),
  });

  await db.collection("auditLogs").add({
    action: "LOCK_EXAM",
    examId,
    timestamp: Timestamp.now(),
    userId: req.auth.uid,
  });

  return { status: "locked" };
});

// ==========  UNLOCK EXAM  ==========
export const unlockExam = onCall(async (req) => {
  const { examId } = req.data;

  if (req.auth.token.role !== "admin")
    throw new HttpsError("permission-denied", "Admins only");

  await db.collection("examLocks").doc(examId).set({
    locked: false,
    lockedBy: req.auth.uid,
    unlockedAt: Timestamp.now(),
  });

  await db.collection("auditLogs").add({
    action: "UNLOCK_EXAM",
    examId,
    timestamp: Timestamp.now(),
    userId: req.auth.uid,
  });

  return { status: "unlocked" };
});

// ========== CSV UPLOAD PROCESSOR ==========
export const processCsv = onObjectFinalized(async (event) => {
  const filePath = event.data.name;
  if (!filePath.includes("marksUploads/")) return;

  const fileBuffer = await admin.storage().bucket().file(filePath).download();
  const csv = fileBuffer.toString();

  const rows = parse(csv, { columns: true, skip_empty_lines: true });

  const batch = db.batch();
  let success = 0;
  let failed = 0;
  const errors = [];

  const examId = filePath.split("/")[1];

  const examLock = await db.collection("examLocks").doc(examId).get();
  if (examLock.exists && examLock.data().locked)
    throw new Error("Exam locked");

  for (let idx = 0; idx < rows.length; idx++) {
    const r = rows[idx];

    if (!r.hallticket || isNaN(r.total)) {
      failed++;
      errors.push({ row: idx + 1, msg: "Invalid row" });
      continue;
    }

    const ref = db.collection("marks").doc();
    batch.set(ref, {
      examId,
      hallticket: r.hallticket,
      marks: {
        internal: Number(r.internal),
        assignment: Number(r.assignment),
        attendance: Number(r.attendance),
        total: Number(r.total),
        grade: r.grade,
      },
      createdAt: Timestamp.now(),
    });

    success++;
  }

  await batch.commit();

  await db.collection("csvUploads").add({
    examId,
    stats: { success, failed },
    errors,
    completedAt: Timestamp.now(),
  });

  await db.collection("auditLogs").add({
    action: "CSV_UPLOAD",
    examId,
    timestamp: Timestamp.now(),
  });
});

// ===== PDF GENERATOR =====
export const generatePdf = onCall(async (req) => {
  const { hallticket } = req.data;

  if (!req.auth)
    throw new HttpsError("unauthenticated");

  const studentSnap = await db.collection("students")
    .where("hallticket", "==", hallticket).get();

  if (studentSnap.empty)
    throw new HttpsError("not-found", "Student not found");

  const marksSnap = await db.collection("marks")
    .where("hallticket", "==", hallticket).get();

  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const font = await pdf.embedFont(StandardFonts.Helvetica);

  let y = 750;
  page.drawText(`Marksheet: ${hallticket}`, { x: 50, y });

  marksSnap.forEach(doc => {
    y -= 20;
    const d = doc.data();
    page.drawText(`${d.examId}   ${d.marks.total}`, { x: 50, y });
  });

  const pdfBytes = await pdf.save();

  const fileRef = admin.storage().bucket().file(`pdfs/${hallticket}.pdf`);
  await fileRef.save(pdfBytes);

  const signed = await fileRef.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 15,
  });

  return { url: signed[0] };
});
