"use client";

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-slate-200/70 pb-5 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow ? <div className="mb-2 text-[11px] font-semibold uppercase tracking-[.20em] text-[#1f4e79] dark:text-[#7aa7d9]">{eyebrow}</div> : null}
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-[2.35rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
