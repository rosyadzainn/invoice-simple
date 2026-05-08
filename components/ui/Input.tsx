import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs text-white/50 font-medium uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-indigo-500/60 focus:bg-white/8 transition-colors duration-200 ${className}`}
        {...props}
      />
    </div>
  );
}
