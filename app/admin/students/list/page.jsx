"use client";

import { useState, useEffect } from "react";
import { db } from "../../../../lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export default function StudentListing() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "students"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // sort by hallTicket
      list.sort((a, b) => a.hallTicket.localeCompare(b.hallTicket));

      setStudents(list);
      setFiltered(list);
    };

    load();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(students);
      return;
    }

    const s = search.toLowerCase();

    setFiltered(
      students.filter(
        (st) =>
          st.hallTicket.toLowerCase().includes(s) ||
          st.name.toLowerCase().includes(s)
      )
    );
  }, [search, students]);

  return (
    <div className="p-6 text-white space-y-6">
      <h1 className="text-2xl font-bold">Students</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hallticket / name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 rounded bg-slate-700 w-64"
      />

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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No students found
                </td>
              </tr>
            )}

            {filtered.map((st) => (
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
