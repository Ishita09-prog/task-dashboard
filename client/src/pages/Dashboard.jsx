import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  Menu,
  Plus,
  Search,
  ListChecks,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import api from "../api";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";
import ListView from "../components/ListView.jsx";
import Analytics from "../components/Analytics.jsx";
import TaskModal from "../components/TaskModal.jsx";
import { isOverdue } from "../lib/helpers.js";

const VIEW_TITLES = {
  board: "Board",
  list: "List",
  analytics: "Analytics",
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("board");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");
  const [assignee, setAssignee] = useState("all");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const { data } = await api.get("/tasks");
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assignees = useMemo(
    () => [...new Set(tasks.map((t) => t.assignee).filter(Boolean))],
    [tasks]
  );

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      if (priority !== "all" && t.priority !== priority) return false;
      if (assignee !== "all" && t.assignee !== assignee) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [tasks, priority, assignee, search]);

  const stats = useMemo(
    () => ({
      total: tasks.length,
      done: tasks.filter((t) => t.status === "done").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      overdue: tasks.filter(isOverdue).length,
    }),
    [tasks]
  );

  // CRUD handlers
  const openNew = (status = "todo") => {
    setEditing({ status });
    setModalOpen(true);
  };
  const openEdit = (task) => {
    setEditing(task);
    setModalOpen(true);
  };

  const saveTask = async (payload) => {
    if (editing?._id) {
      const { data } = await api.put(`/tasks/${editing._id}`, payload);
      setTasks((prev) => prev.map((t) => (t._id === data._id ? data : t)));
    } else {
      const { data } = await api.post("/tasks", payload);
      setTasks((prev) => [data, ...prev]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const deleteTask = async (task) => {
    await api.delete(`/tasks/${task._id}`);
    setTasks((prev) => prev.filter((t) => t._id !== task._id));
    setModalOpen(false);
    setEditing(null);
  };

  const moveTask = async (id, status) => {
    const prev = tasks;
    setTasks((p) => p.map((t) => (t._id === id ? { ...t, status } : t)));
    try {
      await api.put(`/tasks/${id}`, { status });
    } catch (err) {
      console.error(err);
      setTasks(prev); // revert on failure
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        view={view}
        setView={setView}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="glass-strong z-10 border-b border-white/5 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-300"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg font-bold leading-tight">
                {VIEW_TITLES[view]}
              </h1>
              <p className="hidden sm:block text-xs text-slate-400">
                Manage and track your team's work
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-indigo-400/50 transition">
                <Search size={15} className="text-slate-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks…"
                  className="w-36 bg-transparent py-2 text-sm outline-none placeholder:text-slate-500 lg:w-52"
                />
              </div>
              <button
                onClick={() => openNew()}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold hover:bg-indigo-600 active:scale-95 transition"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">New task</span>
              </button>
            </div>
          </div>

          {/* Filter row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex sm:hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 flex-1">
              <Search size={15} className="text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-500"
              />
            </div>
            <FilterSelect
              value={priority}
              onChange={setPriority}
              options={[
                ["all", "All priorities"],
                ["high", "High"],
                ["medium", "Medium"],
                ["low", "Low"],
              ]}
            />
            <FilterSelect
              value={assignee}
              onChange={setAssignee}
              options={[
                ["all", "All assignees"],
                ...assignees.map((a) => [a, a]),
              ]}
            />
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Stat cards */}
          <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard index={0} label="Total Tasks" value={stats.total} icon={ListChecks} accent="#6366F1" />
            <StatCard index={1} label="Completed" value={stats.done} icon={CheckCircle2} accent="#10B981" />
            <StatCard index={2} label="In Progress" value={stats.inProgress} icon={Loader2} accent="#f59e0b" />
            <StatCard index={3} label="Overdue" value={stats.overdue} icon={AlertTriangle} accent="#f43f5e" />
          </div>

          {loading ? (
            <BoardSkeleton />
          ) : view === "board" ? (
            <KanbanBoard
              tasks={filtered}
              onMove={moveTask}
              onAdd={openNew}
              onOpen={openEdit}
            />
          ) : view === "list" ? (
            <ListView tasks={filtered} onOpen={openEdit} />
          ) : (
            <Analytics tasks={tasks} />
          )}
        </div>
      </main>

      <TaskModal
        open={modalOpen}
        task={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={saveTask}
        onDelete={deleteTask}
      />
    </div>
  );
}

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-400/50 transition"
    >
      {options.map(([v, l]) => (
        <option key={v} value={v} className="bg-navy-800">
          {l}
        </option>
      ))}
    </select>
  );
}

function BoardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[0, 1, 2].map((c) => (
        <div key={c} className="glass rounded-2xl p-3">
          <div className="skeleton mb-3 h-5 w-24 rounded-md" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton mb-2.5 h-24 rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}
