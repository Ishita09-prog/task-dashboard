export const COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export const PRIORITY_META = {
  low: { label: "Low", text: "text-sky-300", dot: "#38bdf8", chip: "bg-sky-500/15 text-sky-300 border-sky-400/20" },
  medium: { label: "Medium", text: "text-amber-300", dot: "#f59e0b", chip: "bg-amber-500/15 text-amber-300 border-amber-400/20" },
  high: { label: "High", text: "text-rose-300", dot: "#f43f5e", chip: "bg-rose-500/15 text-rose-300 border-rose-400/20" },
};

export const STATUS_META = {
  todo: { label: "To Do", color: "#818cf8" },
  "in-progress": { label: "In Progress", color: "#f59e0b" },
  done: { label: "Done", color: "#10B981" },
};

export const isOverdue = (task) =>
  task.dueDate &&
  task.status !== "done" &&
  new Date(task.dueDate) < new Date(new Date().toDateString());

export const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

// Deterministic avatar color from a string
export const avatarColor = (str = "") => {
  const palette = ["#6366F1", "#10B981", "#f59e0b", "#f43f5e", "#0ea5e9", "#a855f7"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
};
