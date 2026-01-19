"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNoticePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = {
      title: e.target.title.value,
      description: e.target.description.value,
      priority: e.target.priority.value,
      lastDate: e.target.lastDate.value,
    };

    const res = await fetch("/api/notices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin/notices");
    } else {
      alert("Failed to create notice");
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">➕ Add Notice</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          required
          className="w-full border p-3 rounded"
          placeholder="Notice Title"
        />

        <textarea
          name="description"
          required
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        <select name="priority" className="border p-3 rounded w-full">
          <option value="info">Info</option>
          <option value="warning">Warning ⚠️</option>
          <option value="urgent">Urgent 🚨</option>
        </select>

        <input
          type="date"
          name="lastDate"
          required
          className="border p-3 rounded w-full"
        />

        <button
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Saving..." : "Create Notice"}
        </button>
      </form>
    </div>
  );
}
