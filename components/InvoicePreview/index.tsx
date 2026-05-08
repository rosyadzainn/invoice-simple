"use client";

import { useState } from "react";
import { Download, Printer, Loader2, Link, Check } from "lucide-react";
import { InvoiceData, CURRENCIES } from "@/types/invoice";
import {
  calcSubtotal,
  calcDiscount,
  calcTax,
  calcTotal,
  formatCurrency,
} from "@/lib/calculations";
import { useLanguage } from "@/context/LanguageContext";
import { formatDate } from "@/lib/i18n";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// PDF-safe colour palette (hex only).
//
// Tailwind v4 stores its entire colour scale as oklch() CSS variables:
//   --color-gray-900: oklch(0.21 0.034 264.665)
// html2canvas v1.4.1 cannot parse oklch / lab / lch / color() functions and
// throws "Attempting to parse an unsupported color function 'lab'".
//
// Solution: every element INSIDE #invoice-preview uses inline style={{ }}
// with explicit hex values instead of Tailwind colour utility classes.
// Tailwind classes are kept only for layout, spacing and typography (none of
// those involve colour so they are safe).
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  black:      "#111827", // Tailwind gray-900
  dark:       "#1f2937", // Tailwind gray-800
  mid:        "#374151", // Tailwind gray-700
  muted:      "#6b7280", // Tailwind gray-500
  subtle:     "#9ca3af", // Tailwind gray-400
  faint:      "#d1d5db", // Tailwind gray-300
  divider:    "#f3f4f6", // Tailwind gray-100
  offWhite:   "#f9fafb", // Tailwind gray-50
  red:        "#ef4444", // Tailwind red-500
  white:      "#ffffff",
  accent:     "#10b981", // emerald-500
  accentEnd:  "#14b8a6", // teal-500
} as const;

interface Props {
  data: InvoiceData;
  onShare: () => Promise<void>;
}

export default function InvoicePreview({ data, onShare }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();

  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal  = calcSubtotal(data.items);
  const discount  = calcDiscount(subtotal, data.discount);
  const tax       = calcTax(subtotal - discount, data.taxRate);
  const total     = calcTotal(subtotal, discount, tax);
  const fmt      = (n: number) => formatCurrency(n, currency.symbol);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { downloadInvoicePDF } = await import("@/lib/pdf");
      await downloadInvoicePDF(
        "invoice-preview",
        `${data.invoiceNumber || "invoice"}.pdf`
      );
      supabase.rpc("increment_stat", { col: "pdf" });
    } catch (err) {
      console.error("PDF error:", err);
      alert(`PDF generation failed:\n${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    await onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    import("@/lib/print").then(({ printInvoice }) => {
      printInvoice(data, t, language);
      supabase.rpc("increment_stat", { col: "print" });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Action bar (not captured by html2canvas) ── */}
      <div className="flex items-center gap-2 no-print">
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading
            ? <Loader2 size={13} className="animate-spin" />
            : <Download size={13} />}
          {downloading ? t.generating : t.downloadPDF}
        </Button>
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer size={13} />
          {t.print}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          {copied ? <Check size={13} className="text-emerald-400" /> : <Link size={13} />}
          {copied ? "Copied!" : "Share"}
        </Button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          #invoice-preview  — the element html2canvas captures.
          ALL colour here uses hex inline styles (see constant C above).
          Tailwind classes are used only for non-colour properties.
      ══════════════════════════════════════════════════════════════════════ */}
      <div
        id="invoice-preview"
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          fontFamily:      "Arial, Helvetica, sans-serif",
          backgroundColor: C.white,
          boxShadow:       "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {/* Accent bar */}
        <div style={{ height: "5px", background: data.accentColor }} />

        <div className="p-8 sm:p-10">

          {/* ── Header: sender left / invoice title right ── */}
          <div className="flex justify-between items-start gap-6 mb-10">

            {/* Sender */}
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              {data.logoUrl && (
                <img
                  src={data.logoUrl}
                  alt="Company logo"
                  className="h-10 w-auto object-contain mb-2"
                  style={{ objectPosition: "left" }}
                />
              )}
              <p
                className="text-base font-bold leading-tight truncate"
                style={{ color: C.black }}
              >
                {data.senderName || (
                  <span style={{ color: C.faint }}>{t.phBusinessName}</span>
                )}
              </p>
              {data.senderEmail && (
                <p className="text-xs truncate" style={{ color: C.muted }}>
                  {data.senderEmail}
                </p>
              )}
              {data.senderPhone && (
                <p className="text-xs" style={{ color: C.muted }}>
                  {data.senderPhone}
                </p>
              )}
              {data.senderAddress && (
                <p className="text-xs whitespace-pre-line mt-0.5" style={{ color: C.muted }}>
                  {data.senderAddress}
                </p>
              )}
            </div>

            {/* Invoice title + meta */}
            <div className="text-right flex-shrink-0">
              <h1
                className="text-4xl font-black tracking-tight leading-none mb-4"
                style={{ color: C.black }}
              >
                INVOICE
              </h1>
              <div className="flex flex-col gap-1 text-xs">
                <div className="flex justify-end gap-4">
                  <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>
                    {t.number}
                  </span>
                  <span className="font-bold min-w-0 text-right" style={{ color: C.dark }}>
                    {data.invoiceNumber || "—"}
                  </span>
                </div>
                <div className="flex justify-end gap-4">
                  <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>
                    {t.issueDate}
                  </span>
                  <span className="text-right" style={{ color: C.mid }}>
                    {formatDate(data.issueDate, language)}
                  </span>
                </div>
                {data.dueDate && (
                  <div className="flex justify-end gap-4">
                    <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>
                      {t.dueDate}
                    </span>
                    <span className="font-semibold text-right" style={{ color: C.red }}>
                      {formatDate(data.dueDate, language)}
                    </span>
                  </div>
                )}
                <div className="flex justify-end gap-4 mt-0.5">
                  <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>
                    {t.currency}
                  </span>
                  <span className="text-right" style={{ color: C.mid }}>
                    {data.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-7"
            style={{ backgroundColor: C.divider }}
          />

          {/* ── Bill To ── */}
          <div className="mb-7">
            <p
              className="text-[9px] font-black uppercase tracking-[0.15em] mb-2"
              style={{ color: C.subtle }}
            >
              {t.billTo}
            </p>
            <p className="text-sm font-bold" style={{ color: C.black }}>
              {data.clientName || (
                <span style={{ color: C.faint }}>{t.phClientName}</span>
              )}
            </p>
            {data.clientEmail && (
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                {data.clientEmail}
              </p>
            )}
            {data.clientAddress && (
              <p className="text-xs whitespace-pre-line mt-0.5" style={{ color: C.muted }}>
                {data.clientAddress}
              </p>
            )}
          </div>

          {/* ── Line items table ── */}
          <div className="mb-7">
            <table className="w-full border-collapse">
              <colgroup>
                <col style={{ width: "auto" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "23%" }} />
                <col style={{ width: "23%" }} />
              </colgroup>
              <thead>
                <tr
                  style={{
                    borderBottom: `2px solid ${data.accentColor}`,
                  }}
                >
                  <th
                    className="text-left text-[9px] font-black uppercase tracking-[0.12em] pb-2"
                    style={{ color: C.subtle }}
                  >
                    {t.description}
                  </th>
                  <th
                    className="text-center text-[9px] font-black uppercase tracking-[0.12em] pb-2"
                    style={{ color: C.subtle }}
                  >
                    {t.qty}
                  </th>
                  <th
                    className="text-right text-[9px] font-black uppercase tracking-[0.12em] pb-2"
                    style={{ color: C.subtle }}
                  >
                    {t.rate}
                  </th>
                  <th
                    className="text-right text-[9px] font-black uppercase tracking-[0.12em] pb-2"
                    style={{ color: C.subtle }}
                  >
                    {t.amount}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom:
                        idx < data.items.length - 1
                          ? `1px solid ${C.offWhite}`
                          : "none",
                    }}
                  >
                    <td
                      className="py-2.5 pr-3 text-sm align-top"
                      style={{ color: C.dark }}
                    >
                      {item.description || (
                        <span className="italic text-xs" style={{ color: C.faint }}>
                          {t.noDescription}
                        </span>
                      )}
                    </td>
                    <td
                      className="py-2.5 text-center text-sm align-top"
                      style={{ color: C.muted }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className="py-2.5 text-right text-sm tabular-nums align-top whitespace-nowrap"
                      style={{ color: C.muted }}
                    >
                      {fmt(item.rate)}
                    </td>
                    <td
                      className="py-2.5 text-right text-sm font-semibold tabular-nums align-top whitespace-nowrap"
                      style={{ color: C.dark }}
                    >
                      {fmt(item.quantity * item.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Totals ── */}
          <div className="flex justify-end mb-7">
            <div className="w-48 flex flex-col gap-2">
              <div className="flex justify-between text-sm" style={{ color: C.muted }}>
                <span className="whitespace-nowrap">{t.subtotal}</span>
                <span className="tabular-nums whitespace-nowrap">{fmt(subtotal)}</span>
              </div>
              {data.discount > 0 && (
                <div className="flex justify-between text-sm" style={{ color: C.muted }}>
                  <span className="whitespace-nowrap">{t.discount} ({data.discount}%)</span>
                  <span className="tabular-nums whitespace-nowrap" style={{ color: C.red }}>−{fmt(discount)}</span>
                </div>
              )}

              {data.taxRate > 0 && (
                <div className="flex justify-between text-sm" style={{ color: C.muted }}>
                  <span className="whitespace-nowrap">
                    {t.taxRate} ({data.taxRate}%)
                  </span>
                  <span className="tabular-nums whitespace-nowrap">{fmt(tax)}</span>
                </div>
              )}
              <div
                className="flex justify-between text-sm font-black pt-2.5"
                style={{
                  color: C.black,
                  borderTop: `2px solid ${data.accentColor}`,
                }}
              >
                <span className="whitespace-nowrap">{t.totalDue}</span>
                <span className="tabular-nums whitespace-nowrap">{fmt(total)}</span>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          {data.notes && (
            <>
              <div
                className="h-px mb-5"
                style={{ backgroundColor: C.divider }}
              />
              <div>
                <p
                  className="text-[9px] font-black uppercase tracking-[0.15em] mb-2"
                  style={{ color: C.subtle }}
                >
                  {t.notes}
                </p>
                <p
                  className="text-xs whitespace-pre-line leading-relaxed"
                  style={{ color: C.muted }}
                >
                  {data.notes}
                </p>
              </div>
            </>
          )}
        </div>

        {/* ── Footer stripe ── */}
        <div
          className="px-8 sm:px-10 py-3 flex items-center justify-between"
          style={{ backgroundColor: C.offWhite }}
        >
          <p className="text-[10px] font-medium" style={{ color: C.faint }}>
            {t.thankYou}
          </p>
          <p className="text-[10px]" style={{ color: C.faint }}>
            Simple
          </p>
        </div>
      </div>
    </div>
  );
}
