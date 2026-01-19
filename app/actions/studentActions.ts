"use server";

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseClient";
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

let app: any;
let db: any;
let functions: any;

function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    functions = getFunctions(app);
  }
}

export async function getMarks(hallticket: string) {
  initFirebase();

  const marksQuery = query(
    collection(db, "marks"),
    where("hallticket", "==", hallticket)
  );

  const snap = await getDocs(marksQuery);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPdfDownloadUrl(hallticket: string) {
  initFirebase();
  const generateFn = httpsCallable(functions, "generatePdf");
  const res = await generateFn({ hallticket });
  return res.data.url;
}
