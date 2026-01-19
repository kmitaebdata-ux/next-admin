"use client";

import AuthGuard from "../../components/AuthGuard";
import { logout } from "../../lib/logout";
import FacultySidebar from "../../components/FacultySidebar";

export default function FacultyHome() {
  return (
    <AuthGuard role="faculty">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        <p>Select an option from the sidebar.</p>
      </div>
    </AuthGuard>
  );
}
