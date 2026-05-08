"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Language, LANGUAGE_LABELS } from "@/lib/i18n";

const LANGUAGES = Object.entries(LANGUAGE_LABELS) as [Language, string][];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
      >
        <Globe size={12} className="text-indigo-400" />
        <span className="font-medium uppercase tracking-wide">{language}</span>
        <ChevronDown
          size={11}
          className={`text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 glass rounded-xl border border-white/10 shadow-2xl shadow-black/60 z-50 overflow-hidden">
          {LANGUAGES.map(([code, label]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-xs transition-colors duration-150 ${
                language === code
                  ? "bg-indigo-500/20 text-indigo-300"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span>{label}</span>
              <span className="font-mono text-white/30 uppercase text-[10px]">
                {code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
