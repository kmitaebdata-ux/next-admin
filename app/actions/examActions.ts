"use server";

import { getFunctions, httpsCallable, HttpsCallable } from "firebase/functions";
import { initializeApp, FirebaseApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseClient"; // adjust path

// init client-side firebase in server action
let app: FirebaseApp;
let functions: ReturnType<typeof getFunctions>;

function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    functions = getFunctions(app);
  }
}

export async function lockExamAction(examId: string) {
  initFirebase();

  const lockExamFn: HttpsCallable<any, any> = httpsCallable(functions, "lockExam");
  const res = await lockExamFn({ examId });
  return res.data;
}

export async function unlockExamAction(examId: string) {
  initFirebase();

  const unlockExamFn: HttpsCallable<any, any> = httpsCallable(functions, "unlockExam");
  const res = await unlockExamFn({ examId });
  return res.data;
}
