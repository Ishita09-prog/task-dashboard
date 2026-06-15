import { motion } from "framer-motion";

export default function StatCard({ label, value, icon: Icon, accent, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
            {value}
          </p>
        </div>
        <div
          className="grid h-10 w-10 place-items-center rounded-xl"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}
