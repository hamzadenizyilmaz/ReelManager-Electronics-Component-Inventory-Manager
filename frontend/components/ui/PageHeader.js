"use client";

export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-7 flex flex-col gap-5 border-b border-slate-200/75 pb-6 dark:border-slate-800 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <div className="mb-2 text-[12px] font-bold uppercase tracking-[.20em] text-[#1f4e79] dark:text-[#7aa7d9]">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-[2.05rem] font-semibold leading-tight tracking-[-0.04em] text-slate-950 dark:text-white sm:text-[2.55rem]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-4xl text-[15px] leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5">{actions}</div> : null}
    </div>
  );
}
