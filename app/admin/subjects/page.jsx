"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";

export default function AssignFacultyPage() {
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD DATA
  useEffect(() => {
    async function loadData() {
      try {
        const subjectSnap = await getDocs(collection(db, "subjects"));
        const facultySnap = await getDocs(collection(db, "faculty"));

        setSubjects(subjectSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setFaculty(facultySnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // CSV UPLOAD HANDLER
  const handleCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          for (const row of result.data) {
            if (!row.code || !row.name) continue;

            const subjectRef = doc(db, "subjects", row.code);

            await setDoc(
              subjectRef,
              {
                code: row.code,
                name: row.name,
                semester: Number(row.semester),
                department: row.department,
                assignedFaculty: [],
              },
              { merge: true }
            );
          }

          alert("Subjects uploaded successfully");
          location.reload();
        } catch (err) {
          console.error(err);
          alert("CSV upload failed");
        }
      },
    });
  };

  async function toggleFaculty(subjectId, facultyId, assigned) {
    const subjectRef = doc(db, "subjects", subjectId);
    const subject = subjects.find((s) => s.id === subjectId);
    let updated = subject.assignedFaculty || [];

    updated = assigned
      ? updated.filter((id) => id !== facultyId)
      : [...updated, facultyId];

    await updateDoc(subjectRef, { assignedFaculty: updated });

    setSubjects((prev) =>
      prev.map((s) =>
        s.id === subjectId ? { ...s, assignedFaculty: updated } : s
      )
    );
  }

  if (loading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold">Subjects Management</h1>

      {/* CSV UPLOAD */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <h2 className="text-white font-semibold mb-2">
          Upload Subjects (CSV)
        </h2>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => handleCSV(e.target.files[0])}
          className="text-white"
        />
      </div>

      {/* SUBJECT LIST */}
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="bg-slate-800 p-4 rounded-lg"
        >
          <h2 className="text-white font-semibold">
            {subject.code} – {subject.name}
          </h2>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {faculty.map((f) => {
              const assigned = subject.assignedFaculty?.includes(f.id);
              return (
                <label
                  key={f.id}
                  className="flex items-center gap-2 text-slate-200"
                >
                  <input
                    type="checkbox"
                    checked={assigned}
                    onChange={() =>
                      toggleFaculty(subject.id, f.id, assigned)
                    }
                  />
                  {f.name}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
