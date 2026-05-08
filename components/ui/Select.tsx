import { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export default function Select({ label, className = "", id, children, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className="text-xs text-white/50 font-medium uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full bg-[#111] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500/60 transition-colors duration-200 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
