import { motion } from "framer-motion";
import {
  LayoutDashboard,
  KanbanSquare,
  ListChecks,
  BarChart3,
  CheckSquare,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { initials, avatarColor } from "../lib/helpers.js";

const NAV = [
  { id: "board", label: "Board", icon: KanbanSquare },
  { id: "list", label: "List", icon: ListChecks },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar({ view, setView, open, setOpen }) {
  const { user, logout } = useAuth();

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-indigo-500 shadow-glow">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">TaskFlow</span>
        </div>
        <button
          className="md:hidden text-slate-400 hover:text-white"
          onClick={() => setOpen(false)}
        >
          <X size={20} />
        </button>
      </div>

      <div className="px-3">
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Workspace
        </p>
        <nav className="space-y-1">
          {NAV.map((item) => {
            const active = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setOpen(false);
                }}
                className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl bg-indigo-500/20 border border-indigo-400/30"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <Icon size={18} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-3">
        <div className="glass flex items-center gap-3 rounded-xl p-3">
          <div
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
            style={{ background: avatarColor(user?.name || "U") }}
          >
            {initials(user?.name || "U")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Log out"
            className="text-slate-400 hover:text-rose-400 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="glass-strong hidden md:flex w-64 shrink-0 border-r border-white/5">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className="glass-strong absolute left-0 top-0 h-full w-64 border-r border-white/10"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
