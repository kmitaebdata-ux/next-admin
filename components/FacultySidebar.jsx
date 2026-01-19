"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

export default function FacultySidebar() {
  const router = useRouter();

  const logout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-slate-900 p-4 text-white">
      <h2 className="text-xl font-bold mb-6">Faculty Panel</h2>

     <Link href="/faculty/marks-entry" className="block py-2">
<Link href="/faculty/subjects">📘 My Subjects</Link>

  Marks Entry
</Link>


      <button
        onClick={logout}
        className="mt-6 text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </aside>
  );
}
