"use client";

import AuthGuard from "../../components/AuthGuard";
import { logout } from "../../lib/logout";

export default function AdminDashboard() {
  return (
    <AuthGuard role="admin">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">👋 Welcome, Admin</h1>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard title="Students" icon="👨‍🎓" desc="Manage student records" />
          <DashboardCard title="Subjects" icon="📚" desc="Assign faculty to subjects" />
          <DashboardCard title="Exams" icon="📝" desc="Lock / unlock exams" />
          <DashboardCard title="Roles" icon="🧑‍💼" desc="Assign admin & faculty roles" />
          <DashboardCard title="Maintenance" icon="🧰" desc="System controls & tools" />
        </div>
      </div>
    </AuthGuard>
  );
}

function DashboardCard({ title, icon, desc }) {
  return (
    <div className="bg-slate-800 rounded-lg p-5 shadow hover:shadow-lg transition">
      <div className="text-3xl mb-2">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-slate-400 text-sm mt-1">{desc}</p>
    </div>
  );
}
