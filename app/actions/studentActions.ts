import { initializeApp, FirebaseApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseConfig } from "../../lib/firebaseClient"; // ✅ fixed path
import {
  collection,
  getFirestore,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

let app: FirebaseApp;
function getClientApp() {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export async function addStudent(student: any) {
  const db = getFirestore(getClientApp());
  return addDoc(collection(db, "students"), student);
}

export async function getStudents(filters: any = {}) {
  const db = getFirestore(getClientApp());

  let qRef: any = collection(db, "students");

  // optional filters
  const clauses: any[] = [];
  if (filters.batch) clauses.push(where("batch", "==", filters.batch));
  if (filters.year) clauses.push(where("year", "==", filters.year));
  if (filters.semester) clauses.push(where("semester", "==", filters.semester));
  if (filters.regulation)
    clauses.push(where("regulation", "==", filters.regulation));
  if (filters.section) clauses.push(where("section", "==", filters.section));

  if (clauses.length) qRef = query(qRef, ...clauses);

  const snap = await getDocs(qRef);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteStudent(id: string) {
  const db = getFirestore(getClientApp());
  return deleteDoc(doc(db, "students", id));
}

export async function updateStudent(id: string, data: any) {
  const db = getFirestore(getClientApp());
  return updateDoc(doc(db, "students", id), data);
}

// ✅ Fix TS error: res.data is unknown
type GeneratePdfResponse = {
  url: string;
};

export async function generatePdf(hallticket: string) {
  const functions = getFunctions(getClientApp());
  const generateFn = httpsCallable<{ hallticket: string }, GeneratePdfResponse>(
    functions,
    "generatePdf"
  );

  const res = await generateFn({ hallticket });
  return res.data.url;
}
