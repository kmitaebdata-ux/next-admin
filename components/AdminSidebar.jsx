"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Shield,
  Wrench,
  ClipboardList,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Assign Subjects", href: "/admin/subjects", icon: BookOpen },
  { name: "Marks Template", href: "/admin/marks-template", icon: ClipboardList },
  { name: "Exams", href: "/admin/exams", icon: FileText },
  { name: "Roles", href: "/admin/roles", icon: Shield },
  { name: "Maintenance", href: "/admin/maintenance", icon: Wrench },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    window.location.replace("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col p-4">
      {/* HEADER */}
      <h2 className="text-xl font-bold mb-6">🛠 Admin Panel</h2>

      {/* NAVIGATION */}
      <nav className="space-y-1 flex-1">
        {menu.map(({ name, href, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(href + "/");

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-slate-800 transition"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
}
