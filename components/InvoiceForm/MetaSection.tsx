"use client";

import { InvoiceData, CURRENCIES } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function MetaSection({ data, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest pl-3 border-l-2 border-emerald-500/50">
        {t.meta}
      </h3>

      {/* Accent color picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/40">Accent Color</span>
        <div className="flex items-center gap-2 flex-wrap">
          {["#10b981","#6366f1","#f43f5e","#f59e0b","#0ea5e9","#8b5cf6","#ec4899","#111827"].map((color) => (
            <button
              key={color}
              onClick={() => onChange({ accentColor: color })}
              className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex-shrink-0"
              style={{
                backgroundColor: color,
                outline: data.accentColor === color ? `2px solid ${color}` : "2px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
          <input
            type="color"
            value={data.accentColor}
            onChange={(e) => onChange({ accentColor: e.target.value })}
            className="w-6 h-6 rounded-full cursor-pointer border-0 p-0 overflow-hidden flex-shrink-0"
            title="Custom color"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label={t.invoiceNumber}
          placeholder={t.phInvoiceNumber}
          value={data.invoiceNumber}
          onChange={(e) => onChange({ invoiceNumber: e.target.value })}
        />

        <Select
          label={t.currency}
          value={data.currency}
          onChange={(e) => onChange({ currency: e.target.value })}
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: "#111" }}>
              {c.label}
            </option>
          ))}
        </Select>

        <Input
          label={t.issueDate}
          type="date"
          value={data.issueDate}
          onChange={(e) => onChange({ issueDate: e.target.value })}
        />

        <Input
          label={t.dueDate}
          type="date"
          value={data.dueDate}
          onChange={(e) => onChange({ dueDate: e.target.value })}
        />
      </div>
    </div>
  );
}
