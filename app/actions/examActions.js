"use server";

import { getFunctions, httpsCallable } from "firebase/functions";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseClient"; // update path

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

export async function lockExamAction(examId) {
  const fn = httpsCallable(functions, "lockExam");
  const res = await fn({ examId });
  return res.data;
}

export async function unlockExamAction(examId) {
  const fn = httpsCallable(functions, "unlockExam");
  const res = await fn({ examId });
  return res.data;
}
