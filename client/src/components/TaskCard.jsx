import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, AlertTriangle } from "lucide-react";
import {
  PRIORITY_META,
  formatDate,
  isOverdue,
  initials,
  avatarColor,
} from "../lib/helpers.js";

export default function TaskCard({ task, onClick, overlay = false }) {
  const sortable = useSortable({ id: task._id, data: { task } });
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = sortable;

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const prio = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const overdue = isOverdue(task);

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      {...(overlay ? {} : attributes)}
      {...(overlay ? {} : listeners)}
      onClick={() => onClick?.(task)}
      className={`group cursor-grab active:cursor-grabbing rounded-xl border border-white/10 bg-navy-700/70 p-3.5 transition hover:border-indigo-400/40 hover:-translate-y-0.5 hover:shadow-lift ${
        isDragging ? "opacity-40" : ""
      } ${overlay ? "rotate-3 shadow-lift ring-1 ring-indigo-400/40" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold leading-snug text-warmwhite">
          {task.title}
        </h4>
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ background: prio.dot }}
          title={`${prio.label} priority`}
        />
      </div>

      {task.description && (
        <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${prio.chip}`}
        >
          {prio.label}
        </span>

        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span
              className={`flex items-center gap-1 text-[11px] ${
                overdue ? "text-rose-400" : "text-slate-400"
              }`}
            >
              {overdue ? (
                <AlertTriangle size={12} />
              ) : (
                <CalendarDays size={12} />
              )}
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.assignee && (
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-semibold text-white"
              style={{ background: avatarColor(task.assignee) }}
              title={task.assignee}
            >
              {initials(task.assignee)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
