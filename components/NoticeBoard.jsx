"use client";
import { useEffect, useState } from "react";

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    async function fetchNotices() {
      const res = await fetch("/api/notices");
      const data = await res.json();
      setNotices(data);
    }
    fetchNotices();
  }, []);

  const statusStyle = {
    urgent: "text-red-600 font-bold",
    warning: "text-yellow-600 font-semibold",
    info: "text-green-600",
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow max-h-[500px] overflow-y-auto">
      <ul className="space-y-4">
        {notices.length === 0 && (
          <p className="text-gray-500 text-center">No notices yet</p>
        )}
        {notices.map((notice) => (
          <li key={notice.id} className="border-b pb-2">
            <p className={statusStyle[notice.priority]}>
              [{new Date(notice.postedOn).toLocaleDateString()}]{" "}
              {notice.title}
            </p>
            <p className="text-gray-600 text-sm">{notice.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
