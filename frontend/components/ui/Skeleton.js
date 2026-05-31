"use client";

export default function Skeleton({ className = "h-6 w-full" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 ${className}`} />;
}
