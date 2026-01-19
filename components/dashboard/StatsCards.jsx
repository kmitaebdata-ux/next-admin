"use client";

import { Users, BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebaseClient";
import { collection, getDocs } from "firebase/firestore";

export default function StatsCards() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const [students, subjects, exams, faculty] = await Promise.all([
        getDocs(collection(db, "students")),
        getDocs(collection(db, "subjects")),
        getDocs(collection(db, "exams")),
        getDocs(collection(db, "faculty")),
      ]);

      setStats({
        students: students.size,
        subjects: subjects.size,
        exams: exams.size,
        faculty: faculty.size,
      });
    };

    loadStats();
  }, []);

  if (!stats) return null;

  const cards = [
    { label: "Students", value: stats.students, icon: Users },
    { label: "Subjects", value: stats.subjects, icon: BookOpen },
    { label: "Exams", value: stats.exams, icon: ClipboardList },
    { label: "Faculty", value: stats.faculty, icon: GraduationCap },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-slate-800 p-4 rounded-xl flex gap-4">
          <c.icon className="w-8 h-8 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
