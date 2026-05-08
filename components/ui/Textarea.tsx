import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export default function Textarea({ label, className = "", id, ...props }: TextareaProps) {
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
      <textarea
        id={id}
        className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-indigo-500/60 transition-colors duration-200 resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
