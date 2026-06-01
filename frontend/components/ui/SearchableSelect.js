"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export default function SearchableSelect({
  value,
  onChange,
  options = [],
  placeholder = "Seç",
  searchPlaceholder = "Ara...",
  getLabel = (item) => item?.label || item?.name || "-",
  getValue = (item) => item?.value || item?.id,
  getSearchText,
  disabled = false,
  className = ""
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = useMemo(() => {
    return options.find((item) => String(getValue(item)) === String(value));
  }, [options, value, getValue]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 100);
    return options
      .filter((item) => {
        const text = String(getSearchText ? getSearchText(item) : getLabel(item))
          .toLowerCase()
          .trim();
        return text.includes(q);
      })
      .slice(0, 100);
  }, [options, query, getLabel, getSearchText]);

  function selectItem(item) {
    onChange(getValue(item), item);
    setOpen(false);
    setQuery("");
  }

  function clearValue(event) {
    event.stopPropagation();
    onChange("", null);
    setQuery("");
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 text-left text-sm text-slate-900 outline-none transition hover:bg-slate-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
      >
        <span className={selected ? "truncate" : "truncate text-slate-400 dark:text-slate-500"}>
          {selected ? getLabel(selected) : placeholder}
        </span>
        <span className="flex items-center gap-1">
          {selected ? (
            <span
              role="button"
              tabIndex={0}
              onClick={clearValue}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              <X size={15} />
            </span>
          ) : null}
          <ChevronDown size={17} className={`text-slate-400 transition ${open ? "rotate-180" : ""}`} />
        </span>
      </button>

      {open ? (
        <>
          <button type="button" aria-label="close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 dark:border-slate-800 dark:bg-slate-950">
            <div className="border-b border-slate-200 p-3 dark:border-slate-800">
              <div className="relative">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto p-1">
              {filtered.length ? filtered.map((item) => {
                const itemValue = getValue(item);
                const active = String(itemValue) === String(value);
                return (
                  <button
                    key={itemValue}
                    type="button"
                    onClick={() => selectItem(item)}
                    className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"}`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{getLabel(item)}</span>
                      {getSearchText ? <span className={`mt-0.5 block truncate text-xs ${active ? "text-blue-100" : "text-slate-400"}`}>{getSearchText(item)}</span> : null}
                    </span>
                    {active ? <Check size={16} /> : null}
                  </button>
                );
              }) : (
                <div className="px-3 py-8 text-center text-sm text-slate-500 dark:text-slate-400">Sonuç bulunamadı.</div>
              )}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
