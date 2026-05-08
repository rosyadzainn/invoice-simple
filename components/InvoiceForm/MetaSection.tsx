"use client";

import { InvoiceData, CURRENCIES, InvoiceTemplate } from "@/types/invoice";
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

      {/* Template picker */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/40">Template</span>
        <div className="flex items-start gap-3">
          {(
            [
              {
                id: "simple" as InvoiceTemplate,
                label: "Simple",
                thumb: (
                  <div className="w-full h-full flex flex-col">
                    <div className="h-1 w-full rounded-t-sm" style={{ background: data.accentColor }} />
                    <div className="flex-1 p-1.5 flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-1">
                        <div className="flex flex-col gap-0.5 flex-1">
                          <div className="h-1.5 rounded-sm w-3/4" style={{ background: "#111827" }} />
                          <div className="h-1 rounded-sm w-1/2" style={{ background: "#d1d5db" }} />
                        </div>
                        <div className="flex flex-col items-end gap-0.5">
                          <div className="h-2 rounded-sm w-6" style={{ background: "#111827" }} />
                          <div className="h-1 rounded-sm w-5" style={{ background: "#e5e7eb" }} />
                        </div>
                      </div>
                      <div className="h-px w-full" style={{ background: "#f3f4f6" }} />
                      <div className="h-px w-full mt-0.5" style={{ background: data.accentColor, opacity: 0.8 }} />
                      <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                      <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                      <div className="flex justify-end mt-0.5">
                        <div className="h-1.5 rounded-sm w-1/2" style={{ background: "#111827" }} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "modern" as InvoiceTemplate,
                label: "Modern",
                thumb: (
                  <div className="w-full h-full flex flex-col">
                    <div className="rounded-t-sm p-1.5 flex justify-between items-start gap-1" style={{ background: data.accentColor }}>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="h-1.5 rounded-sm w-3/4" style={{ background: "rgba(255,255,255,0.9)" }} />
                        <div className="h-1 rounded-sm w-1/2" style={{ background: "rgba(255,255,255,0.5)" }} />
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="h-2 rounded-sm w-5" style={{ background: "rgba(255,255,255,0.9)" }} />
                        <div className="h-1 rounded-sm w-4" style={{ background: "rgba(255,255,255,0.5)" }} />
                      </div>
                    </div>
                    <div className="flex-1 p-1.5 flex flex-col gap-1">
                      <div className="h-1 rounded-sm w-1/2" style={{ background: "#111827" }} />
                      <div className="h-px w-full mt-0.5" style={{ background: data.accentColor, opacity: 0.8 }} />
                      <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                      <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                      <div className="flex justify-end mt-0.5">
                        <div className="h-1.5 rounded-sm w-1/2" style={{ background: "#111827" }} />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: "minimal" as InvoiceTemplate,
                label: "Minimal",
                thumb: (
                  <div className="w-full h-full flex flex-col p-1.5 gap-1">
                    <div className="flex justify-between items-start gap-1">
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="h-1.5 rounded-sm w-3/4" style={{ background: "#111827" }} />
                        <div className="h-1 rounded-sm w-1/2" style={{ background: "#d1d5db" }} />
                      </div>
                      <div className="flex flex-col items-end gap-0.5">
                        <div className="h-1.5 rounded-sm w-6 tracking-widest" style={{ background: "#111827" }} />
                        <div className="h-1 rounded-sm w-4" style={{ background: data.accentColor, opacity: 0.8 }} />
                      </div>
                    </div>
                    <div className="h-0.5 w-full" style={{ background: "#111827" }} />
                    <div className="h-1 rounded-sm w-1/2" style={{ background: "#e5e7eb" }} />
                    <div className="h-0.5 w-full mt-1" style={{ background: "#111827" }} />
                    <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                    <div className="h-1 rounded-sm w-full" style={{ background: "#f3f4f6" }} />
                    <div className="flex justify-end mt-0.5">
                      <div className="h-1.5 rounded-sm w-1/2" style={{ background: data.accentColor }} />
                    </div>
                  </div>
                ),
              },
            ] as { id: InvoiceTemplate; label: string; thumb: React.ReactNode }[]
          ).map(({ id, label, thumb }) => {
            const active = (data.template ?? "simple") === id;
            return (
              <button
                key={id}
                onClick={() => onChange({ template: id })}
                className="flex flex-col items-center gap-1.5 flex-1"
              >
                <div
                  className="w-full rounded-lg overflow-hidden transition-all duration-200"
                  style={{
                    aspectRatio: "3/4",
                    border: active
                      ? `2px solid ${data.accentColor}`
                      : "2px solid rgba(255,255,255,0.08)",
                    background: "#ffffff",
                    boxShadow: active ? `0 0 0 2px ${data.accentColor}33` : "none",
                  }}
                >
                  {thumb}
                </div>
                <span
                  className="text-[10px] font-medium transition-colors"
                  style={{ color: active ? data.accentColor : "rgba(255,255,255,0.35)" }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

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
