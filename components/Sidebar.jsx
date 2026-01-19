"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        router.push("/login");
        return;
      }

      const token = await user.getIdTokenResult();
      setIsAdmin(token.claims.admin === true);
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  // Prevent rendering until auth is resolved
  if (loading) return null;

  // Hide sidebar if not admin
  if (!isAdmin) return null;

  const menuItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Students", href: "/admin/students" },
    { name: "Faculty", href: "/admin/faculty" },
    { name: "Roles", href: "/admin/roles" },
    { name: "Curriculum", href: "/admin/curriculum" },
    { name: "Marks Entry", href: "/admin/marks-entry" },
    { name: "Exams", href: "/admin/exams" },
    { name: "Maintenance", href: "/admin/maintenance" },
  ];

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">KMIT Admin</h2>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded transition ${
              pathname === item.href
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-10 text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </aside>
  );
}
