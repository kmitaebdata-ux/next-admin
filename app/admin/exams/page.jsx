"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../../lib/firebaseClient";

import toast from "react-hot-toast";

export default function AdminExamsPage() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const load = async () => {
      // 1️⃣ load exams
      const snap = await getDocs(collection(db, "exams"));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 2️⃣ load lock statuses
      const locksSnap = await getDocs(collection(db, "examLocks"));
      const locks = {};
      locksSnap.forEach(d => {
        locks[d.id] = d.data().locked;
      });

      // 3️⃣ merge lock status into exams
      const merged = list.map(e => ({
        ...e,
        locked: locks[e.id] || false,
      }));

      setExams(merged);
    };

    load();
  }, []);

  const toggleLock = async (exam) => {
    try {
      const functions = getFunctions(app);

      const fn = httpsCallable(
        functions,
        exam.locked ? "unlockExam" : "lockExam"
      );

      await fn({ examId: exam.id });

      // update UI state
      setExams(prev =>
        prev.map(e =>
          e.id === exam.id ? { ...e, locked: !e.locked } : e
        )
      );

      toast.success(
        exam.locked ? "Exam unlocked 🟢" : "Exam locked 🔒"
      );
    } catch (err) {
      console.error(err);
      toast.error("Permission denied or network error ❌");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-6">🔐 Admin – Exam Locks</h1>

      {exams.length === 0 && (
        <div className="text-gray-400">No exams found.</div>
      )}

      {exams.map(exam => (
        <div
          key={exam.id}
          className="flex items-center justify-between bg-gray-800 p-4 rounded mb-2"
        >
          <div>
            <div className="font-semibold">{exam.name}</div>
            <div className="text-sm text-gray-400">
              Status: {exam.locked ? "🔒 Locked" : "🟢 Active"}
            </div>
          </div>

          <button
            onClick={() => toggleLock(exam)}
            className={`px-4 py-1 rounded ${
              exam.locked ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {exam.locked ? "Unlock" : "Lock"}
          </button>
        </div>
      ))}
    </div>
  );
}
