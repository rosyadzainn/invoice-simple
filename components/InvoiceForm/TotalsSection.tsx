"use client";

import { InvoiceData, CURRENCIES } from "@/types/invoice";
import { calcSubtotal, calcDiscount, calcTax, calcTotal, formatCurrency } from "@/lib/calculations";
import { useLanguage } from "@/context/LanguageContext";
import Textarea from "@/components/ui/Textarea";
import NumberInput from "@/components/ui/NumberInput";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function TotalsSection({ data, onChange }: Props) {
  const { t } = useLanguage();
  const currencySymbol = CURRENCIES.find((c) => c.code === data.currency)?.symbol ?? "$";
  const subtotal  = calcSubtotal(data.items);
  const discount  = calcDiscount(subtotal, data.discount);
  const tax       = calcTax(subtotal - discount, data.taxRate);
  const total     = calcTotal(subtotal, discount, tax);

  return (
    <div className="flex flex-col gap-5">
      {/* Discount + Tax rate */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest whitespace-nowrap">
            {t.discount}
          </span>
          <div className="flex items-center gap-2">
            <NumberInput
              value={data.discount}
              onChange={(v) => onChange({ discount: v })}
              className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white text-center focus:border-emerald-500/60 transition-colors duration-200"
              placeholder="0"
            />
            <span className="text-white/40 text-sm font-medium">%</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-white/40 uppercase tracking-widest whitespace-nowrap">
            {t.taxRate}
          </span>
          <div className="flex items-center gap-2">
            <NumberInput
              value={data.taxRate}
              onChange={(v) => onChange({ taxRate: v })}
              className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white text-center focus:border-emerald-500/60 transition-colors duration-200"
              placeholder="0"
            />
            <span className="text-white/40 text-sm font-medium">%</span>
          </div>
        </div>
      </div>

      {/* Totals breakdown */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2.5"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div className="flex justify-between text-sm text-white/55">
          <span>{t.subtotal}</span>
          <span className="tabular-nums">{formatCurrency(subtotal, currencySymbol)}</span>
        </div>

        {data.discount > 0 && (
          <div className="flex justify-between text-sm text-white/55">
            <span>{t.discount} ({data.discount}%)</span>
            <span className="tabular-nums text-red-400">−{formatCurrency(discount, currencySymbol)}</span>
          </div>
        )}

        {data.taxRate > 0 && (
          <div className="flex justify-between text-sm text-white/55">
            <span>{t.taxRate} ({data.taxRate}%)</span>
            <span className="tabular-nums">{formatCurrency(tax, currencySymbol)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-bold text-white pt-2.5 border-t border-white/10">
          <span>{t.totalDue}</span>
          <span className="gradient-text tabular-nums">
            {formatCurrency(total, currencySymbol)}
          </span>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        label={t.notesPaymentTerms}
        placeholder={t.phNotes}
        value={data.notes}
        onChange={(e) => onChange({ notes: e.target.value })}
        rows={3}
      />
    </div>
  );
}
