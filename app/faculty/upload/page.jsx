"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "../../../lib/firebaseClient"; // ✅ FIXED IMPORT

export default function UploadMarksPage() {
  const [file, setFile] = useState(null);
  const [examId, setExamId] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");

  const storage = getStorage();

  async function handleUpload() {
    if (!file || !examId) {
      setError("Select CSV and enter examId");
      return;
    }

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        setError("You must be logged in");
        return;
      }

      const path = `marksUploads/${examId}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (err) => {
          setError(err.message);
        },
        () => {
          setUploaded(true);
        }
      );
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Upload Marks CSV</h1>

      <input
        type="text"
        placeholder="Enter Exam ID"
        value={examId}
        onChange={(e) => setExamId(e.target.value)}
        className="border p-2 rounded w-80"
      />

      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2 rounded w-80"
      />

      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Upload CSV
      </button>

      {progress > 0 && !uploaded && <p>Uploading: {progress}%</p>}

      {uploaded && (
        <p className="text-green-600 font-semibold">
          ✔ CSV uploaded successfully. Processing in background...
        </p>
      )}

      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
