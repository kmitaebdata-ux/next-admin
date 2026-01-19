"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

export default function FacultyMarksEntry() {
  const [faculty, setFaculty] = useState("");
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});

  const [form, setForm] = useState({
    batch: "",
    regulation: "",
    year: "",
    semester: "",
    subjectCode: "",
    examType: "",
  });

  /* ================= AUTH ================= */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setFaculty(user.email);
    });
    return () => unsub();
  }, []);

  /* ================= LOAD SUBJECTS ================= */
  useEffect(() => {
    const loadSubjects = async () => {
      const snap = await getDocs(collection(db, "subjects"));
      setSubjects(snap.docs.map((d) => d.data()));
    };
    loadSubjects();
  }, []);

  /* ================= LOAD STUDENTS ================= */
  useEffect(() => {
    const { batch, regulation, year, semester } = form;
    if (!batch || !regulation || !year || !semester) return;

    const loadStudents = async () => {
      const q = query(
        collection(db, "students"),
        where("batch", "==", batch),
        where("regulation", "==", regulation),
        where("year", "==", year),
        where("semester", "==", semester)
      );

      const snap = await getDocs(q);
      setStudents(snap.docs.map((d) => d.data()));
    };

    loadStudents();
  }, [form.batch, form.regulation, form.year, form.semester]);

  /* ================= CALCULATE ================= */
  const calculate = (m) => {
    const subjective = [m.q1, m.q2, m.q3, m.q4, m.q5]
      .map(Number)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((a, b) => a + b, 0);

    const total =
      Number(m.objective || 0) +
      Number(m.assignment || 0) +
      subjective;

    return { subjective, total };
  };

  /* ================= SAVE ================= */
  const saveMarks = async () => {
    for (const s of students) {
      const m = marks[s.hallTicket] || {};
      const { subjective, total } = calculate(m);

      await addDoc(collection(db, "marks"), {
        hallTicket: s.hallTicket,
        studentName: s.name,
        ...form,
        ...m,
        best3: subjective,
        total,
        maxMarks: 40,
        faculty,
        createdAt: new Date(),
      });
    }
    alert("Marks saved successfully");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Faculty Marks Entry</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-3 gap-3 bg-slate-800/60 p-4 rounded-xl">
        {["batch", "regulation", "year", "semester", "subjectCode", "examType"].map((k) => (
          <input
            key={k}
            placeholder={k}
            value={form[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            className="bg-slate-700 p-2 rounded"
          />
        ))}
      </div>

      {/* TABLE */}
      {students.length > 0 && (
        <div className="overflow-x-auto bg-slate-900/70 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800">
              <tr>
                <th>HT</th>
                <th>Name</th>
                <th>Obj</th>
                <th>Assign</th>
                <th>Q1</th>
                <th>Q2</th>
                <th>Q3</th>
                <th>Q4</th>
                <th>Q5</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const m = marks[s.hallTicket] || {};
                const { total } = calculate(m);

                return (
                  <tr key={s.hallTicket}>
                    <td>{s.hallTicket}</td>
                    <td>{s.name}</td>
                    {["objective", "assignment", "q1", "q2", "q3", "q4", "q5"].map((k) => (
                      <td key={k}>
                        <input
                          type="number"
                          className="bg-slate-700 w-16 p-1 rounded"
                          onChange={(e) =>
                            setMarks({
                              ...marks,
                              [s.hallTicket]: {
                                ...m,
                                [k]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    ))}
                    <td className="font-semibold">{total || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {students.length > 0 && (
        <button
          onClick={saveMarks}
          className="bg-green-600 px-6 py-2 rounded-lg"
        >
          Save Marks
        </button>
      )}
    </div>
  );
}
