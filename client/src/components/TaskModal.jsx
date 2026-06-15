import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Loader2 } from "lucide-react";

const empty = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignee: "",
};

const toInputDate = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

export default function TaskModal({ open, task, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: toInputDate(task.dueDate),
        assignee: task.assignee || "",
      });
    } else {
      setForm(empty);
    }
  }, [task, open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        dueDate: form.dueDate || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = Boolean(task?._id);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="glass-strong relative w-full max-w-lg rounded-t-2xl sm:rounded-2xl p-6 shadow-lift"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">
                {isEdit ? "Edit task" : "New task"}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-300">
                  Title
                </label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={set("title")}
                  placeholder="What needs to be done?"
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60 transition placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={3}
                  placeholder="Add more detail…"
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60 transition placeholder:text-slate-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Status"
                  value={form.status}
                  onChange={set("status")}
                  options={[
                    ["todo", "To Do"],
                    ["in-progress", "In Progress"],
                    ["done", "Done"],
                  ]}
                />
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={set("priority")}
                  options={[
                    ["low", "Low"],
                    ["medium", "Medium"],
                    ["high", "High"],
                  ]}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={set("dueDate")}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60 transition [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-300">
                    Assignee
                  </label>
                  <input
                    value={form.assignee}
                    onChange={set("assignee")}
                    placeholder="Name"
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60 transition placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => onDelete(task)}
                    className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                ) : (
                  <span />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-600 active:scale-[.98] transition disabled:opacity-60"
                  >
                    {saving && <Loader2 size={15} className="animate-spin" />}
                    {isEdit ? "Save changes" : "Create task"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-300">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-navy-700 px-3 py-2.5 text-sm outline-none focus:border-indigo-400/60 transition"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v} className="bg-navy-800">
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}
