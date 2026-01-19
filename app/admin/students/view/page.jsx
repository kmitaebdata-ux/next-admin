"use client";

import { useState, useEffect } from "react";
import { db } from "../../../../lib/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default function StudentsView() {
  const [batch, setBatch] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");

  const [students, setStudents] = useState([]);

  const loadStudents = async () => {
    if (!batch || !year || !semester) return;

    let q = query(
      collection(db, "students"),
      where("batch", "==", batch),
      where("year", "==", Number(year)),
      where("semester", "==", Number(semester))
    );

    const snap = await getDocs(q);
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadStudents();
  }, [batch, year, semester]);

  return (
    <div className="space-y-6 p-6 text-white">
      <h1 className="text-2xl font-bold">Students View</h1>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        >
          <option value="">Batch</option>
          <option value="2023-27">2023-27</option>
          <option value="2022-26">2022-26</option>
          <option value="2021-25">2021-25</option>
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        >
          <option value="">Year</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        >
          <option value="">Semester</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded border border-slate-700">
        <table className="min-w-max bg-slate-900 text-sm w-full">
          <thead className="bg-slate-800 text-gray-300">
            <tr>
              <th className="px-3 py-2 text-left">Hall Ticket</th>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Batch</th>
              <th className="px-3 py-2 text-left">Reg</th>
              <th className="px-3 py-2 text-left">Year</th>
              <th className="px-3 py-2 text-left">Sem</th>
              <th className="px-3 py-2 text-left">Branch</th>
              <th className="px-3 py-2 text-left">Section</th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No students found
                </td>
              </tr>
            )}

            {students.map((st) => (
              <tr key={st.hallTicket} className="border-b border-slate-700">
                <td className="px-3 py-2">{st.hallTicket}</td>
                <td className="px-3 py-2">{st.name}</td>
                <td className="px-3 py-2">{st.batch}</td>
                <td className="px-3 py-2">{st.regulation}</td>
                <td className="px-3 py-2">{st.year}</td>
                <td className="px-3 py-2">{st.semester}</td>
                <td className="px-3 py-2">{st.branch}</td>
                <td className="px-3 py-2">{st.section}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
