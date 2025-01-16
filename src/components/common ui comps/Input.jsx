// src/components/ui/Input.js
import React from "react";

export function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-slate-300 rounded-md text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-1 hover:border-slate-400 transition-all duration-150 ${className}  ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } `}
    />
  );
}
