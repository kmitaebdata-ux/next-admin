use client;

import { useEffect, useState } from react;
import { db } from @libfirebaseClient;
import { collection, getDocs } from firebasefirestore;

export default function ExamStatus() {
  const [exams, setExams] = useState([]);

  useEffect(() = {
    const loadExams = async () = {
      const snap = await getDocs(collection(db, exams));
      setExams(snap.docs.map(d = d.data()));
    };

    loadExams();
  }, []);

  return (
    div className=bg-slate-800 p-6 rounded-xl
      h2 className=text-xl font-semibold mb-4🔒 Exam Statush2

      ul className=space-y-3
        {exams.map((e, i) = (
          li key={i} className=flex justify-between
            span{e.name}span
            span className={`px-3 py-1 rounded text-sm ${
              e.locked
                 bg-red-60020 text-red-400
                 bg-green-60020 text-green-400
            }`}
              {e.locked  Locked 🔒  Active 🟢}
            span
          li
        ))}
      ul
    div
  );
}
