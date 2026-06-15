import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { STATUS_META, PRIORITY_META } from "../lib/helpers.js";
import ActivityFeed from "./ActivityFeed.jsx";

const tooltipStyle = {
  background: "rgba(15,23,42,0.95)",
  border: "1px solid rgba(148,163,184,0.2)",
  borderRadius: 12,
  color: "#F8FAFC",
  fontSize: 12,
};

export default function Analytics({ tasks }) {
  const statusData = ["todo", "in-progress", "done"].map((s) => ({
    name: STATUS_META[s].label,
    value: tasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].color,
  }));

  const priorityData = ["low", "medium", "high"].map((p) => ({
    name: PRIORITY_META[p].label,
    value: tasks.filter((t) => t.priority === p).length,
    color: PRIORITY_META[p].dot,
  }));

  const total = tasks.length || 1;
  const done = tasks.filter((t) => t.status === "done").length;
  const completionRate = Math.round((done / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 gap-4 lg:grid-cols-3"
    >
      {/* Donut */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold">Status breakdown</h3>
        <p className="text-xs text-slate-400">Where your tasks stand</p>
        <div className="relative mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={58}
                outerRadius={84}
                paddingAngle={3}
                stroke="none"
              >
                {statusData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 -mt-6 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{completionRate}%</span>
            <span className="text-[11px] text-slate-400">complete</span>
          </div>
        </div>
      </div>

      {/* Bar */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold">Tasks by priority</h3>
        <p className="text-xs text-slate-400">Distribution of effort</p>
        <div className="mt-2 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>
              <XAxis
                dataKey="name"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={56}>
                {priorityData.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold">Recent activity</h3>
        <p className="text-xs text-slate-400">Latest updates</p>
        <div className="mt-3">
          <ActivityFeed tasks={tasks} />
        </div>
      </div>
    </motion.div>
  );
}
