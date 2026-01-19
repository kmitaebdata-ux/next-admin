export default function StatusBadge({ status }) {
  const styles =
    status === "active"
      ? "bg-green-600/20 text-green-400"
      : "bg-red-600/20 text-red-400";

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${styles}`}>
      {status === "active" ? "🟢 Active" : "🔒 Locked"}
    </span>
  );
}
