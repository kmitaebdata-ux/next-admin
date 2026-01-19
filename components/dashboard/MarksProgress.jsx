"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export default function MarksProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadProgress = async () => {
      const students = await getDocs(collection(db, "students"));
      const marks = await getDocs(collection(db, "marks"));

      if (students.size === 0) return;

      const percent = Math.round(
        (marks.size / students.size) * 100
      );

      setProgress(percent);
    };

    loadProgress();
  }, []);

  return (
    <div className="bg-slate-800 p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">📊 Marks Entry Progress</h2>

      <div className="w-full bg-slate-700 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-gray-400">
        {progress}% marks submitted
      </p>
    </div>
  );
}
