import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckSquare, Loader2, Mail, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="glass-strong w-full max-w-md rounded-2xl p-8 shadow-lift"
      >
        <div className="flex items-center gap-2 mb-8">
          <div className="grid place-items-center w-9 h-9 rounded-xl bg-indigo-500">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">TaskFlow</span>
        </div>

        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-slate-400 text-sm mb-6">
          Start organizing your work in minutes.
        </p>

        {error && (
          <div className="mb-4 text-sm rounded-lg border border-rose-400/30 bg-rose-500/10 text-rose-300 px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Field
            icon={<User size={16} />}
            type="text"
            placeholder="Ishita Sharma"
            value={name}
            onChange={setName}
            label="Name"
          />
          <Field
            icon={<Mail size={16} />}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            label="Email"
          />
          <Field
            icon={<Lock size={16} />}
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={setPassword}
            label="Password"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 active:scale-[.98] transition font-semibold py-2.5 disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ icon, label, type, placeholder, value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 focus-within:border-indigo-400/60 transition">
        <span className="text-slate-500">{icon}</span>
        <input
          required
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-500"
        />
      </div>
    </label>
  );
}
