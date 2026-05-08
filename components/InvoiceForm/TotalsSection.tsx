"use client";

import { useRef } from "react";
import { Upload, X } from "lucide-react";
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
  const qrRef  = useRef<HTMLInputElement>(null);
  const sigRef = useRef<HTMLInputElement>(null);

  const currencySymbol = CURRENCIES.find((c) => c.code === data.currency)?.symbol ?? "$";
  const subtotal = calcSubtotal(data.items);
  const discount = calcDiscount(subtotal, data.discount);
  const tax      = calcTax(subtotal - discount, data.taxRate);
  const total    = calcTotal(subtotal, discount, tax);

  const handleFile = (key: "qrUrl" | "signatureUrl") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ [key]: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Discount + Tax */}
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
      <div className="rounded-xl p-4 flex flex-col gap-2.5" style={{ background: "rgba(255,255,255,0.03)" }}>
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
          <span className="gradient-text tabular-nums">{formatCurrency(total, currencySymbol)}</span>
        </div>
      </div>

      {/* Payment Details */}
      <Textarea
        label={t.paymentDetails}
        placeholder={t.phPaymentDetails}
        value={data.paymentDetails}
        onChange={(e) => onChange({ paymentDetails: e.target.value })}
        rows={3}
      />

      {/* QR Code upload */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/40">Payment QR Code</span>
        <div className="flex items-center gap-3">
          {data.qrUrl ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src={data.qrUrl} alt="QR" className="w-full h-full object-contain bg-white/5" />
              <button
                onClick={() => onChange({ qrUrl: null })}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={9} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => qrRef.current?.click()}
              className="w-16 h-16 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 text-white/30 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 flex-shrink-0"
            >
              <Upload size={14} />
              <span className="text-[8px] font-semibold uppercase tracking-wide">QR</span>
            </button>
          )}
          <input ref={qrRef} type="file" accept="image/*" className="hidden" onChange={handleFile("qrUrl")} />
          <p className="text-xs text-white/25">Upload QRIS or payment QR</p>
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

      {/* Signature upload */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-white/40">Signature</span>
        <div className="flex items-center gap-3">
          {data.signatureUrl ? (
            <div className="relative h-12 w-36 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
              <img src={data.signatureUrl} alt="Signature" className="w-full h-full object-contain bg-white/5" />
              <button
                onClick={() => onChange({ signatureUrl: null })}
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              >
                <X size={9} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => sigRef.current?.click()}
              className="h-12 w-36 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 text-white/30 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 flex-shrink-0"
            >
              <Upload size={14} />
              <span className="text-[8px] font-semibold uppercase tracking-wide">Signature</span>
            </button>
          )}
          <input ref={sigRef} type="file" accept="image/*" className="hidden" onChange={handleFile("signatureUrl")} />
          <p className="text-xs text-white/25">Upload signature image</p>
        </div>
      </div>
    </div>
  );
}
