"use client";

import { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { auth } from "../../../lib/firebaseClient";

export default function AdminRolesPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from Firestore (or static list)
  useEffect(() => {
    // TEMP USERS LIST (replace with real list later)
    setUsers([
      {
        uid: "1LXHe7kEZzflIoPMyLxfwQOO4f03",
        email: "admin@kmit.in",
      },
      {
        uid: "gxw3YZU1MaccHLgld0uHLiXOlIe2",
        email: "faculty@kmit.in",
      },
    ]);
    setLoading(false);
  }, []);

  const assignRole = async (uid, role) => {
    try {
      const functions = getFunctions();
      const setRole = httpsCallable(functions, "setUserRole");

      await setRole({ uid, role });

      alert(`✅ ${role} role assigned`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign role");
    }
  };

  if (loading) return <p>Loading users…</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Role Management</h1>

      <table className="w-full border border-slate-700">
        <thead>
          <tr className="bg-slate-800">
            <th className="p-2">Email</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.uid} className="border-t border-slate-700">
              <td className="p-2">{u.email}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => assignRole(u.uid, "admin")}
                  className="bg-blue-600 px-3 py-1 rounded"
                >
                  Make Admin
                </button>
                <button
                  onClick={() => assignRole(u.uid, "faculty")}
                  className="bg-green-600 px-3 py-1 rounded"
                >
                  Make Faculty
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-slate-400">
        User must re-login for role to apply.
      </p>
    </div>
  );
}
