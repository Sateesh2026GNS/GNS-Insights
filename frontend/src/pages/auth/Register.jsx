<<<<<<< HEAD
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRegisterRoles, register as registerApi, getApiErrorMessage } from "../../api/authApi";
import AuthSlider from "../../components/auth/AuthSlider";
import PasswordInput from "../../components/auth/PasswordInput";
import BrandLogo from "../../components/common/BrandLogo";
import { ROLES } from "../../config/permissions";

const REGISTRATION_SUCCESS_MESSAGE =
  "Registration completed successfully. Please log in using your registered email address and password.";

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7a2 2 0 012-2h3v16M12 21V4a2 2 0 012-2h3a2 2 0 012 2v17M8 10h.01M8 14h.01M8 18h.01M16 10h.01M16 14h.01M16 18h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const RoleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

const FALLBACK_ROLES = ROLES.map((r) => ({
  id: r.id,
  name: r.name,
  description: r.description,
}));

export default function Register() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [roleOptions, setRoleOptions] = useState(FALLBACK_ROLES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getRegisterRoles()
      .then((rows) => {
        if (Array.isArray(rows) && rows.length) setRoleOptions(rows);
      })
      .catch(() => {
        /* keep fallback roles */
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!companyName.trim() || !fullName.trim() || !email.trim()) {
      setError("Fill in company name, full name, and company email");
      return;
    }
    if (!role) {
      setError("Please select a role");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
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
        password,
        role
      );
      // Never auto-login or open the dashboard after registration.
      const message =
        data?.message || REGISTRATION_SUCCESS_MESSAGE;
      setSuccess(message);
      window.setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { registeredEmail: email.trim(), registrationSuccess: message },
        });
      }, 1800);
    } catch (err) {
      setError(getApiErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl">
        <div
          className="relative overflow-hidden rounded-3xl bg-white shadow-2xl"
          style={{ minHeight: "640px" }}
        >
          <div className="flex h-full flex-col md:flex-row">
            <AuthSlider className="hidden w-full md:flex md:w-[44%] lg:w-1/2">
              <h2 className="mb-4 text-4xl font-bold">Welcome Back!</h2>
              <p className="mb-8 max-w-xs text-center text-sm text-teal-50/90">
                Enter your personal details to use all of site features
              </p>
              <Link
                to="/login"
                className="rounded-lg border-2 border-white px-8 py-3 font-bold uppercase text-white transition hover:bg-white hover:text-teal-600"
              >
                SIGN IN
              </Link>
            </AuthSlider>

            <div className="flex w-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-10 sm:px-10 md:w-[56%] md:px-10 lg:w-1/2 lg:px-12">
              <div className="mb-6 w-full max-w-md text-center lg:max-w-none">
                <div className="mb-4 flex justify-center">
                  <BrandLogo size="xl" />
                </div>
                <h1 className="mb-2 text-4xl font-bold text-gray-900">GNS Insights</h1>
                <p className="text-sm text-gray-600">Business Intelligence • Analytics • AI</p>
                <p className="mt-1 text-xs text-gray-500">
                  Create your company account with a company email
                </p>
              </div>

              {success && (
                <div className="mb-4 w-full max-w-md rounded-lg border border-green-400 bg-green-100 p-3 text-sm text-green-800 lg:max-w-none">
                  {success}
                  <p className="mt-1 text-xs text-green-700">Redirecting to login…</p>
                </div>
              )}

              {error && (
                <div className="mb-4 w-full max-w-md rounded-lg border border-red-400 bg-red-100 p-3 text-sm text-red-700 lg:max-w-none">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-3 lg:max-w-none"
              >
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <BuildingIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="box-border h-12 w-full rounded-lg border-none bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    required
                    disabled={Boolean(success)}
                  />
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <UserIcon />
                  </div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="box-border h-12 w-full rounded-lg border-none bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    required
                    disabled={Boolean(success)}
                  />
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    placeholder="Company Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="box-border h-12 w-full rounded-lg border-none bg-gray-100 py-3 pl-12 pr-4 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    required
                    disabled={Boolean(success)}
                  />
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400">
                    <RoleIcon />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="box-border h-12 w-full cursor-pointer appearance-none rounded-lg border-none bg-gray-100 py-3 pl-12 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                    required
                    aria-label="Role"
                    disabled={Boolean(success)}
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.name} value={opt.name}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <div
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    aria-hidden
                  >
                    <ChevronDownIcon />
                  </div>
                  {roleOptions.find((r) => r.name === role)?.description && (
                    <p className="mt-1 pl-1 text-[11px] text-gray-500">
                      {roleOptions.find((r) => r.name === role).description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <PasswordInput
                    placeholder="Create Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<LockIcon />}
                    autoComplete="new-password"
                    disabled={Boolean(success)}
                  />
                  <PasswordInput
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    leftIcon={<LockIcon />}
                    autoComplete="new-password"
                    disabled={Boolean(success)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || Boolean(success)}
                  className="w-full rounded-lg bg-teal-600 py-3 font-bold uppercase tracking-wider text-white transition hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "SIGN UP"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as registerApi } from "../../api/authApi";
import { ROLES } from "../../config/permissions";
import useAuth from "../../hooks/useAuth";
import AuthSlider from "../../components/auth/AuthSlider";
import PasswordInput from "../../components/auth/PasswordInput";

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7a2 2 0 012-2h3v16M12 21V4a2 2 0 012-2h3a2 2 0 012 2v17M8 10h.01M8 14h.01M8 18h.01M16 10h.01M16 14h.01M16 18h.01" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Operator");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!companyName.trim() || !fullName.trim() || !email.trim()) {
      setError("Fill in company name, full name, and email");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
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
        password,
        selectedRole
      );
      if (data.email_verification_required || !data.access_token) {
        setSuccess(data.message || "Registration successful. Please verify your email before signing in.");
        return;
      }
      const scopedUser = {
        ...data.user,
        role: selectedRole,
        roles: [selectedRole],
      };
      login({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user: scopedUser,
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative" style={{ minHeight: "600px" }}>
          <div className="flex h-full">
              {/* Left Panel - Image Slider + Sign In Prompt */}
              <AuthSlider className="w-1/2">
                <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-center text-sm mb-8 max-w-xs text-teal-50/90">
                  Enter your personal details to use all of site features
                </p>
                <Link
                  to="/login"
                  className="px-8 py-3 border-2 border-white text-white font-bold uppercase rounded-lg hover:bg-white hover:text-teal-600 transition"
                >
                  SIGN IN
                </Link>
              </AuthSlider>

              {/* Right Panel - Register Form */}
              <div className="w-1/2 flex flex-col justify-center items-center p-12 bg-white overflow-y-auto">
                <div className="text-center mb-8 w-full">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">SMRT</h1>
                  <p className="text-gray-600 text-sm">Manufacturing ERP</p>
                  <p className="text-gray-500 text-xs mt-1">Create Your Own Manufacturing ERP Account</p>
                </div>

                {success && (
                  <div className="w-full mb-4 p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg text-sm">
                    {success}{" "}
                    <Link to="/login" className="font-semibold underline">
                      Sign in
                    </Link>
                  </div>
                )}

                {error && (
                  <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400">
                      <BuildingIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
                      <UserIcon />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full pl-12 pr-10 py-3 bg-gray-100 border-none rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-4 text-gray-400 pointer-events-none">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400">
                      <UserIcon />
                    </div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-3.5 text-gray-400">
                      <MailIcon />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border-none rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <PasswordInput
                      placeholder="Password (min 8)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      leftIcon={<LockIcon />}
                      autoComplete="new-password"
                    />
                    <PasswordInput
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      leftIcon={<LockIcon />}
                      autoComplete="new-password"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    Remember Password
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold uppercase tracking-wider rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "SIGN UP"}
                  </button>
                </form>

                <p className="text-xs text-gray-600 mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
