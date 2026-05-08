"use client";

import { InvoiceData, CURRENCIES } from "@/types/invoice";
import { Translations, Language, formatDate } from "@/lib/i18n";
import { calcSubtotal, calcDiscount, calcTax, calcTotal, formatCurrency } from "@/lib/calculations";
import { C } from "./colors";

interface Props {
  data: InvoiceData;
  t: Translations;
  language: Language;
}

export default function TemplateSimple({ data, t, language }: Props) {
  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal = calcSubtotal(data.items);
  const discount = calcDiscount(subtotal, data.discount);
  const tax      = calcTax(subtotal - discount, data.taxRate);
  const total    = calcTotal(subtotal, discount, tax);
  const fmt      = (n: number) => formatCurrency(n, currency.symbol);

  return (
    <>
      {/* Accent bar */}
      <div style={{ height: "5px", background: data.accentColor }} />

      <div className="p-8 sm:p-10">
        {/* Header */}
        <div className="flex justify-between items-start gap-6 mb-10">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            {data.logoUrl && (
              <img
                src={data.logoUrl}
                alt="Company logo"
                style={{
                  display: "block",
                  maxHeight: "40px",
                  maxWidth: "150px",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                  objectPosition: "left center",
                  marginBottom: "8px",
                }}
              />
            )}
            <p className="text-base font-bold leading-tight break-words" style={{ color: C.black }}>
              {data.senderName || <span style={{ color: C.faint }}>{t.phBusinessName}</span>}
            </p>
            {data.senderEmail && (
              <p className="text-xs break-all" style={{ color: C.muted }}>{data.senderEmail}</p>
            )}
            {data.senderPhone && (
              <p className="text-xs" style={{ color: C.muted }}>{data.senderPhone}</p>
            )}
            {data.senderAddress && (
              <p className="text-xs whitespace-pre-line mt-0.5" style={{ color: C.muted }}>{data.senderAddress}</p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <h1 className="text-4xl font-black tracking-tight leading-none mb-4" style={{ color: C.black }}>
              INVOICE
            </h1>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex justify-end gap-4">
                <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>{t.number}</span>
                <span className="font-bold" style={{ color: C.dark }}>{data.invoiceNumber || "—"}</span>
              </div>
              <div className="flex justify-end gap-4">
                <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>{t.issueDate}</span>
                <span style={{ color: C.mid }}>{formatDate(data.issueDate, language)}</span>
              </div>
              {data.dueDate && (
                <div className="flex justify-end gap-4">
                  <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>{t.dueDate}</span>
                  <span className="font-semibold" style={{ color: C.red }}>{formatDate(data.dueDate, language)}</span>
                </div>
              )}
              <div className="flex justify-end gap-4 mt-0.5">
                <span className="font-medium whitespace-nowrap" style={{ color: C.subtle }}>{t.currency}</span>
                <span style={{ color: C.mid }}>{data.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-7" style={{ backgroundColor: C.divider }} />

        {/* Bill To */}
        <div className="mb-7">
          <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: C.subtle }}>
            {t.billTo}
          </p>
          <p className="text-sm font-bold" style={{ color: C.black }}>
            {data.clientName || <span style={{ color: C.faint }}>{t.phClientName}</span>}
          </p>
          {data.clientEmail && (
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{data.clientEmail}</p>
          )}
          {data.clientAddress && (
            <p className="text-xs whitespace-pre-line mt-0.5" style={{ color: C.muted }}>{data.clientAddress}</p>
          )}
        </div>

        {/* Line items */}
        <div className="mb-7">
          <table className="w-full border-collapse">
            <colgroup>
              <col style={{ width: "auto" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "23%" }} />
              <col style={{ width: "23%" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: `2px solid ${data.accentColor}` }}>
                <th className="text-left text-[9px] font-black uppercase tracking-[0.12em] pb-2" style={{ color: C.subtle }}>{t.description}</th>
                <th className="text-center text-[9px] font-black uppercase tracking-[0.12em] pb-2" style={{ color: C.subtle }}>{t.qty}</th>
                <th className="text-right text-[9px] font-black uppercase tracking-[0.12em] pb-2" style={{ color: C.subtle }}>{t.rate}</th>
                <th className="text-right text-[9px] font-black uppercase tracking-[0.12em] pb-2" style={{ color: C.subtle }}>{t.amount}</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{ borderBottom: idx < data.items.length - 1 ? `1px solid ${C.offWhite}` : "none" }}
                >
                  <td className="py-2.5 pr-3 text-sm align-top" style={{ color: C.dark }}>
                    {item.description || <span className="italic text-xs" style={{ color: C.faint }}>{t.noDescription}</span>}
                  </td>
                  <td className="py-2.5 text-center text-sm align-top" style={{ color: C.muted }}>{item.quantity}</td>
                  <td className="py-2.5 text-right text-sm tabular-nums align-top whitespace-nowrap" style={{ color: C.muted }}>{fmt(item.rate)}</td>
                  <td className="py-2.5 text-right text-sm font-semibold tabular-nums align-top whitespace-nowrap" style={{ color: C.dark }}>{fmt(item.quantity * item.rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-7">
          <div className="w-full max-w-xs flex flex-col gap-2">
            <div className="flex justify-between gap-6 text-sm" style={{ color: C.muted }}>
              <span className="whitespace-nowrap">{t.subtotal}</span>
              <span className="tabular-nums whitespace-nowrap">{fmt(subtotal)}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between gap-6 text-sm" style={{ color: C.muted }}>
                <span className="whitespace-nowrap">{t.discount} ({data.discount}%)</span>
                <span className="tabular-nums whitespace-nowrap" style={{ color: C.red }}>−{fmt(discount)}</span>
              </div>
            )}
            {data.taxRate > 0 && (
              <div className="flex justify-between gap-6 text-sm" style={{ color: C.muted }}>
                <span className="whitespace-nowrap">{t.taxRate} ({data.taxRate}%)</span>
                <span className="tabular-nums whitespace-nowrap">{fmt(tax)}</span>
              </div>
            )}
            <div
              className="flex justify-between gap-6 text-sm font-black pt-2.5"
              style={{ color: C.black, borderTop: `2px solid ${data.accentColor}` }}
            >
              <span className="whitespace-nowrap">{t.totalDue}</span>
              <span className="tabular-nums whitespace-nowrap">{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Payment Details + QR */}
        {(data.paymentDetails || data.qrUrl) && (
          <>
            <div className="h-px mb-5" style={{ backgroundColor: C.divider }} />
            <div className="mb-5 flex justify-between items-start gap-6">
              {data.paymentDetails && (
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: C.subtle }}>{t.paymentDetails}</p>
                  <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: C.muted }}>{data.paymentDetails}</p>
                </div>
              )}
              {data.qrUrl && (
                <img src={data.qrUrl} alt="Payment QR" style={{ width: "80px", height: "80px", objectFit: "contain", display: "block", flexShrink: 0 }} />
              )}
            </div>
          </>
        )}

        {/* Notes */}
        {data.notes && (
          <>
            <div className="h-px mb-5" style={{ backgroundColor: C.divider }} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-2" style={{ color: C.subtle }}>{t.notes}</p>
              <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: C.muted }}>{data.notes}</p>
            </div>
          </>
        )}

        {/* Signature */}
        {data.signatureUrl && (
          <div className="flex flex-col items-end mt-8">
            <img src={data.signatureUrl} alt="Signature" style={{ maxHeight: "56px", width: "auto", objectFit: "contain", display: "block" }} />
            <div className="mt-1 pt-1" style={{ width: "160px", borderTop: `1px solid ${C.faint}`, textAlign: "right" }}>
              <p className="text-[9px] uppercase tracking-[0.15em]" style={{ color: C.subtle }}>Authorized Signature</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
