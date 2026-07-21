import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Password field with optional left icon and show/hide toggle.
 * Matches auth page styling (gray-100 inputs, teal focus ring).
<<<<<<< HEAD
 * Eye icon is absolutely positioned so it never reduces input text width layout.
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Password",
  leftIcon,
  className = "",
  id,
  name,
  autoComplete,
  disabled = false,
<<<<<<< HEAD
  required = false,
=======
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
}) {
  const [visible, setVisible] = useState(false);

  return (
<<<<<<< HEAD
    <div className={`relative w-full min-w-0 ${className}`}>
      {leftIcon && (
        <div className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400">
=======
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-4 top-3.5 text-gray-400 pointer-events-none">
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
          {leftIcon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
<<<<<<< HEAD
        required={required}
        className={`box-border h-12 w-full min-w-0 rounded-lg border-none bg-gray-100 py-3 text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 ${
          leftIcon ? "pl-12" : "pl-4"
        } pr-11`}
=======
        className={`w-full ${leftIcon ? "pl-12" : "pl-4"} pr-12 py-3 bg-gray-100 border-none rounded-xl text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 ${className}`}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
<<<<<<< HEAD
        className="absolute right-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-5 w-5 shrink-0" /> : <Eye className="h-5 w-5 shrink-0" />}
=======
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/40 disabled:opacity-50 z-10"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
>>>>>>> ee869e0309add751071723e75449cd32fdc937f8
      </button>
    </div>
  );
}
