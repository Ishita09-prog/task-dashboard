import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, AlertTriangle } from "lucide-react";
import {
  PRIORITY_META,
  STATUS_META,
  formatDate,
  isOverdue,
  initials,
  avatarColor,
} from "../lib/helpers.js";

const priorityRank = { high: 3, medium: 2, low: 1 };

export default function ListView({ tasks, onOpen }) {
  const [sort, setSort] = useState({ key: "dueDate", dir: "asc" });

  const sorted = [...tasks].sort((a, b) => {
    const dir = sort.dir === "asc" ? 1 : -1;
    if (sort.key === "priority") {
      return (priorityRank[a.priority] - priorityRank[b.priority]) * dir;
    }
    if (sort.key === "dueDate") {
      const av = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bv = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return (av - bv) * dir;
    }
    return String(a[sort.key] || "").localeCompare(String(b[sort.key] || "")) * dir;
  });

  const toggle = (key) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );

  const Th = ({ k, children, className = "" }) => (
    <th className={`px-4 py-3 text-left font-semibold ${className}`}>
      <button
        onClick={() => toggle(k)}
        className="flex items-center gap-1 hover:text-white transition"
      >
        {children}
        <ArrowUpDown size={12} className="opacity-50" />
      </button>
    </th>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass overflow-hidden rounded-2xl"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-400 border-b border-white/10">
            <tr>
              <Th k="title">Task</Th>
              <Th k="status">Status</Th>
              <Th k="priority">Priority</Th>
              <Th k="dueDate">Due</Th>
              <Th k="assignee">Assignee</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((task) => {
              const prio = PRIORITY_META[task.priority] || PRIORITY_META.medium;
              const status = STATUS_META[task.status];
              const overdue = isOverdue(task);
              return (
                <tr
                  key={task._id}
                  onClick={() => onOpen(task)}
                  className="cursor-pointer border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-warmwhite">{task.title}</p>
                    {task.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
                        {task.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: status.color }}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${prio.chip}`}
                    >
                      {prio.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {task.dueDate ? (
                      <span
                        className={`inline-flex items-center gap-1 text-xs ${
                          overdue ? "text-rose-400" : "text-slate-300"
                        }`}
                      >
                        {overdue && <AlertTriangle size={12} />}
                        {formatDate(task.dueDate)}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {task.assignee ? (
                      <span className="inline-flex items-center gap-2 text-xs text-slate-300">
                        <span
                          className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-white"
                          style={{ background: avatarColor(task.assignee) }}
                        >
                          {initials(task.assignee)}
                        </span>
                        {task.assignee}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-600">Unassigned</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No tasks match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
