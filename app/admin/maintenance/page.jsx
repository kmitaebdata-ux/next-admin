export default function AdminMaintenancePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">System Maintenance</h1>

      <ul className="list-disc ml-6 text-slate-300 space-y-2">
        <li>Lock / Unlock Exams</li>
        <li>Freeze Marks Entry</li>
        <li>Recalculate Results</li>
        <li>System Notices</li>
      </ul>

      <p className="mt-4 text-yellow-400">
        (Next step: add real maintenance controls)
      </p>
    </div>
  );
}
