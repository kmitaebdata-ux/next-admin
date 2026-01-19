"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../lib/firebaseClient";

export default function StudentsPage() {
  const [course, setCourse] = useState("B.TECH");
  const [year, setYear] = useState(2);
  const [branch, setBranch] = useState("CSE");
  const [section, setSection] = useState("A");

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  async function fetchStudents() {
    setLoading(true);

    const q = query(
      collection(db, "students"),
      where("course", "==", course),
      where("year", "==", Number(year)),
      where("branch", "==", branch),
      where("section", "==", section)
    );

    const snap = await getDocs(q);
    setStudents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

    setLoading(false);
  }

  return (
    <div className="p-6 text-slate-900">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Students</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg">
          Add
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-lg p-4 flex flex-wrap gap-4 items-end mb-6">
        <Filter label="Course" value={course} onChange={setCourse} options={["B.TECH"]} />
        <Filter label="Year" value={year} onChange={setYear} options={[1, 2, 3, 4]} />
        <Filter label="Branch" value={branch} onChange={setBranch} options={["CSE", "IT", "CSM"]} />
        <Filter label="Section" value={section} onChange={setSection} options={["A", "B", "C"]} />

        <button
          onClick={fetchStudents}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Get
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mb-4">
        <button className="btn">Generate</button>
        <button className="btn">Download QR</button>
        <button className="btn">Upload Images</button>
      </div>

      {/* TABLE */}
      <div className="overflow-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-200 text-slate-800">
            <tr>
              <th className="p-3 text-left font-semibold">Photo</th>
              <th className="p-3 text-left font-semibold">Roll No</th>
              <th className="p-3 text-left font-semibold">HTNO</th>
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Section</th>
              <th className="p-3 text-left font-semibold">Phone</th>
              <th className="p-3 text-left font-semibold">Father Name</th>
              <th className="p-3 text-left font-semibold">Father Phone</th>
              <th className="p-3 text-left font-semibold">Regulation</th>
              <th className="p-3 text-left font-semibold">Profile</th>
            </tr>
          </thead>

          <tbody className="text-slate-800">
            {loading && (
              <tr>
                <td colSpan="10" className="p-6 text-center text-slate-600">
                  Loading…
                </td>
              </tr>
            )}

            {!loading && students.length === 0 && (
              <tr>
                <td colSpan="10" className="p-6 text-center text-slate-500">
                  No students found
                </td>
              </tr>
            )}

            {!loading &&
              students.map((s) => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="p-3">
                    <img
                      src={s.photoUrl || "/avatar.png"}
                      className="w-8 h-8 rounded-full"
                      alt="photo"
                    />
                  </td>
                  <td className="p-3">{s.rollNo}</td>
                  <td className="p-3 text-blue-600 font-medium">{s.htno}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.section}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.fatherName}</td>
                  <td className="p-3">{s.fatherPhone}</td>
                  <td className="p-3">{s.regulation}</td>
                  <td className="p-3">👁</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- FILTER COMPONENT ---------- */

function Filter({ label, value, onChange, options }) {
  return (
    <div className="min-w-[120px]">
      <label className="block text-xs mb-1 text-slate-600 font-medium">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-slate-800 bg-white w-full"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
