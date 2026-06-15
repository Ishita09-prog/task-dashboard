import { CheckCircle2, Circle, Clock } from "lucide-react";
import { STATUS_META, timeAgo } from "../lib/helpers.js";

const iconFor = (status) => {
  if (status === "done") return { Icon: CheckCircle2, color: "#10B981" };
  if (status === "in-progress") return { Icon: Clock, color: "#f59e0b" };
  return { Icon: Circle, color: "#818cf8" };
};

export default function ActivityFeed({ tasks, limit = 6 }) {
  const recent = [...tasks]
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    )
    .slice(0, limit);

  if (recent.length === 0) {
    return <p className="text-xs text-slate-500">No activity yet.</p>;
  }

  return (
    <ul className="space-y-3">
      {recent.map((t) => {
        const { Icon, color } = iconFor(t.status);
        return (
          <li key={t._id} className="flex items-start gap-3">
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full"
              style={{ background: `${color}1f`, color }}
            >
              <Icon size={15} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-warmwhite">{t.title}</p>
              <p className="text-[11px] text-slate-400">
                {STATUS_META[t.status].label} ·{" "}
                {timeAgo(t.updatedAt || t.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
