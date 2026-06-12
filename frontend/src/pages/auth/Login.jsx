import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login as loginApi } from "../../api/authApi";
import { ROLES } from "../../config/permissions";
import useAuth from "../../hooks/useAuth";

const EnvelopeIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [demoRole, setDemoRole] = useState("Operator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDemoLogin = () => {
    login({ name: demoRole, role: demoRole });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await loginApi(email.trim(), password);
      login({ access_token: data.access_token, user: data.user });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Login failed. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0c1222] relative overflow-hidden">
      {/* Industrial-style background: gradient + subtle pattern */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920')`,
          filter: "blur(4px) saturate(0.7) brightness(0.4)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-900/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(20,184,166,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(13,148,136,0.06)_0%,transparent_50%)]" />

      <div className="relative w-full max-w-md">
        {/* Glassmorphism form */}
        <div
          className="rounded-2xl p-8 md:p-10 shadow-2xl border border-slate-500/30"
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 0 0 1px rgba(148, 163, 184, 0.1), 0 0 40px -10px rgba(13, 148, 136, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              SMR<span className="text-teal-400">T</span>
            </h1>
            <p className="text-white/90 text-lg mt-1 font-medium">Manufacturing ERP</p>
            <p className="text-slate-400 text-sm mt-1">Systematic Manufacturing Real-time Tracking</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 transition">
                <EnvelopeIcon />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-teal-500/50 focus-within:ring-1 focus-within:ring-teal-500/30 transition">
                <LockIcon />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-500 bg-slate-800/80 text-teal-500 focus:ring-teal-500/50"
                />
                Remember Me
              </label>
              <Link to="#" className="text-white/90 hover:text-teal-400 transition">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition shadow-lg hover:shadow-teal-500/20 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
                boxShadow: "0 4px 14px rgba(15, 118, 150, 0.35)",
              }}
            >
              {loading ? "Signing in…" : "Login to SMRT"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-2">API: admin@smrt.local / admin123</p>

          <div className="mt-6 rounded-xl border-2 border-teal-500/50 bg-teal-500/10 p-4">
            <p className="text-center text-sm font-semibold text-teal-400">Demo Login (no API)</p>
            <p className="text-slate-300 text-xs mt-1 mb-2">Select role to see different screens:</p>
            <select
              value={demoRole}
              onChange={(e) => setDemoRole(e.target.value)}
              className="w-full rounded-lg border border-slate-600/50 bg-slate-800/80 px-3 py-2 text-sm text-white focus:border-teal-500/50 focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium text-white transition"
              style={{ background: "linear-gradient(180deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)" }}
            >
              Continue as {demoRole}
            </button>
          </div>

          <p className="text-center text-slate-400 text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-teal-400 hover:text-teal-300 underline">Register</Link>
            {" · "}
            <Link to="/landing" className="text-teal-400 hover:text-teal-300 underline">Learn more</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
