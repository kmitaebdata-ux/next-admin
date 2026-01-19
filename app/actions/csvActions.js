"use server";

import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "@/lib/firebaseClient";

export async function uploadCsv(file, examId) {
  const storage = getStorage();
  const uid = auth.currentUser?.uid;

  if (!uid) throw new Error("not authenticated");

  const path = `marksUploads/${examId}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);

  // NOTE: resume + progress handled client side
  return await uploadBytesResumable(storageRef, file);
}
