"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth } from "../../../lib/firebaseClient";
import { db } from "../../../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

export default function FacultySubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) return;

      setUser(currentUser);

      try {
        const q = query(
          collection(db, "subjects"),
          where("assignedFaculty", "array-contains", currentUser.uid)
        );

        const snap = await getDocs(q);

        setSubjects(
          snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        );
      } catch (err) {
        console.error("Failed to load faculty subjects", err);
        alert("Unable to load subjects");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) return <p className="p-6">Loading subjects…</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        My Assigned Subjects
      </h1>

      {subjects.length === 0 && (
        <p className="text-slate-400">
          No subjects assigned yet.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((s) => (
          <div
            key={s.id}
            className="bg-slate-800 rounded-lg p-4"
          >
            <h2 className="text-white font-semibold">
              {s.code} – {s.name}
            </h2>
            <p className="text-slate-400 text-sm">
              Semester {s.semester} | {s.department}
            </p>

            <button
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              disabled
            >
              Marks Entry (Coming Soon)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
