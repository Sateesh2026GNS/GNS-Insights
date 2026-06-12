import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register as registerApi } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";

const BuildingIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7a2 2 0 012-2h3v16M12 21V4a2 2 0 012-2h3a2 2 0 012 2v17M8 10h.01M8 14h.01M8 18h.01M16 10h.01M16 14h.01M16 18h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!companyName.trim() || !fullName.trim() || !email.trim()) {
      setError("Fill in company name, full name, and email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const data = await registerApi(
        companyName.trim(),
        fullName.trim(),
        email.trim(),
        password
      );
      login({
        access_token: data.access_token,
        user: data.user,
      });
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.detail;
      setError(typeof msg === "string" ? msg : "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0c1222] relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920')`,
          filter: "blur(4px) saturate(0.7) brightness(0.4)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-950/90 to-slate-900/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(249,115,22,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(59,130,246,0.06)_0%,transparent_50%)]" />

      <div className="relative w-full max-w-xl">
        <div
          className="rounded-2xl p-8 md:p-10 shadow-2xl border border-slate-500/30"
          style={{
            background: "rgba(30, 41, 59, 0.5)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 0 0 1px rgba(148, 163, 184, 0.1), 0 0 40px -10px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              SMR<span className="text-orange-500">T</span>
            </h1>
            <p className="text-white/90 text-lg mt-1 font-medium">Manufacturing ERP</p>
            <p className="text-slate-400 text-sm mt-1">Create your Manufacturing ERP account</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="companyName" className="sr-only">Company Name</label>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30 transition">
                <BuildingIcon />
                <input
                  id="companyName"
                  type="text"
                  placeholder="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30 transition">
                <UserIcon />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30 transition">
                <MailIcon />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30 transition">
                  <LockIcon />
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Password (min 6)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="flex items-center gap-3 rounded-xl bg-slate-800/60 border border-slate-600/50 px-4 py-3 focus-within:border-sky-500/50 focus-within:ring-1 focus-within:ring-sky-500/30 transition">
                  <LockIcon />
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-slate-500 bg-slate-800/80 text-orange-500 focus:ring-orange-500/50"
                />
                Remember Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white uppercase tracking-wider text-sm transition shadow-lg hover:shadow-orange-500/20 disabled:opacity-50"
              style={{
                background: "linear-gradient(180deg, var(--color-accent) 0%, var(--color-accent-dark) 100%)",
                boxShadow: "0 4px 14px rgba(234, 88, 12, 0.4)",
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
