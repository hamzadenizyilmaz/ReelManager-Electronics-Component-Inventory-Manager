"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/formatters";

export default function SelectField({ label, value, onChange, options = [], placeholder = "Seçiniz", className = "", disabled = false, required = false, name }) {
  return (
    <label className={cn("block", className)}>
      {label ? <span className="field-label">{label}</span> : null}
      <span className="select-shell">
        <select
          name={name}
          required={required}
          disabled={disabled}
          className="select-control"
          value={value ?? ""}
          onChange={(event) => onChange?.(event.target.value, event)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={String(option.value)} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
      </span>
    </label>
  );
}
