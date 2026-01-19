"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";

// examId format:
// <regulation>-<batch>-<branch>-Y<year>-S<semester>-<subjectCode>-<examType>

function ComboSelect({ value, onChange, listId, options, placeholder }) {
  return (
    <>
      <input
        list={listId}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-700 p-2 rounded w-full text-white"
      />

      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}

export default function MarksTemplateGenerator() {
  const [form, setForm] = useState({
    academicYear: "2025-2026",
    regulation: "",
    batch: "",
    year: "",
    semester: "",
    examType: "",
    subjectCode: "",
    subjectName: "",
    branch: "",
    section: "",
  });

  const [examId, setExamId] = useState("");

  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {
    const {
      regulation,
      batch,
      branch,
      year,
      semester,
      subjectCode,
      examType,
    } = form;

    if (
      regulation &&
      batch &&
      branch &&
      year &&
      semester &&
      subjectCode &&
      examType
    ) {
      setExamId(
        `${regulation}-${batch}-${branch}-Y${year}-S${semester}-${subjectCode}-${examType}`
      );
    } else {
      setExamId("");
    }
  }, [form]);

  const generateTemplate = () => {
    if (!examId) {
      alert("Fill required fields before generating template.");
      return;
    }

    const rows = [
      {
        examId,
        academicYear: form.academicYear,
        regulation: form.regulation,
        batch: form.batch,
        year: form.year,
        semester: form.semester,
        examType: form.examType,
        subjectCode: form.subjectCode,
        subjectName: form.subjectName,
        branch: form.branch,
        section: form.section,
        hallTicket: "",
        studentName: "",
        objective: "",
        assignment: "",
        q1: "",
        q2: "",
        q3: "",
        q4: "",
        q5: "",
        best3: "",
        total: "",
        maxMarks: 40,
      },
    ];

    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const fileName = `${examId}_40M.csv`;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const selectOptions = {
    regulation: ["R20", "R22", "R24"],
    batch: ["2023-27", "2022-26", "2021-25"],
    year: ["1", "2", "3", "4"],
    semester: ["1", "2"],
    examType: ["MID-1", "MID-2", "SEM"],
    branch: ["CSE", "ECE", "EEE", "IT", "MECH"],
    section: ["A", "B", "C"],
  };

  return (
    <div className="max-w-4xl space-y-6 text-white">
      <h1 className="text-2xl font-bold">Admin – Marks Template Generator</h1>

      <div className="grid grid-cols-2 gap-4 bg-slate-800/60 p-6 rounded-xl">
        {Object.keys(form).map((k) =>
          selectOptions[k] ? (
            <ComboSelect
              key={k}
              value={form[k]}
              listId={k}
              placeholder={k}
              options={selectOptions[k]}
              onChange={(val) => update(k, val)}
            />
          ) : (
            <input
              key={k}
              placeholder={k}
              value={form[k]}
              onChange={(e) => update(k, e.target.value)}
              className="bg-slate-700 p-2 rounded w-full"
            />
          )
        )}
      </div>

      {examId && (
        <div className="p-4 bg-slate-700 rounded">
          <b>Generated Exam ID:</b> {examId}
        </div>
      )}

      <div className="bg-slate-900/60 p-4 rounded-xl text-sm">
        <b>Marks Pattern:</b>
        <br />
        Objective – 10
        <br />
        Assignment – 10
        <br />
        Subjective – 20 (Best 3 of 5)
        <br />
        <b>Total – 40</b>
      </div>

      <button
        onClick={generateTemplate}
        className="bg-emerald-600 px-6 py-3 rounded-xl font-semibold"
      >
        Generate & Download CSV Template
      </button>
    </div>
  );
}
