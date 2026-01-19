"use server";

import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/lib/firebaseClient";

let app: any;

function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
}

export async function validateUploadAction(examId: string) {
  initFirebase();

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) throw new Error("Not authenticated");
  if (!examId) throw new Error("Invalid examId");

  return { ok: true };
}
