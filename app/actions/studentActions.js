"use server";

import { getFunctions, httpsCallable } from "firebase/functions";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseClient";

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const db = getFirestore(app);

export async function getMarks(hallticket) {
  const q = query(collection(db, "marks"), where("hallticket", "==", hallticket));
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getPdfDownloadUrl(hallticket) {
  const fn = httpsCallable(functions, "generatePdf");
  const res = await fn({ hallticket });
  return res.data.url;
}
