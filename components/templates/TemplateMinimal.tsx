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

export default function TemplateMinimal({ data, t, language }: Props) {
  const currency  = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal  = calcSubtotal(data.items);
  const discount  = calcDiscount(subtotal, data.discount);
  const tax       = calcTax(subtotal - discount, data.taxRate);
  const total     = calcTotal(subtotal, discount, tax);
  const fmt       = (n: number) => formatCurrency(n, currency.symbol);

  return (
    <div className="p-10 sm:p-12">
      {/* Header */}
      <div className="flex justify-between items-start gap-8 mb-10">
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
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
                marginBottom: "12px",
              }}
            />
          )}
          <p className="text-base font-bold leading-snug break-words" style={{ color: C.black }}>
            {data.senderName || <span style={{ color: C.faint }}>{t.phBusinessName}</span>}
          </p>
          {data.senderEmail && (
            <p className="text-xs break-all mt-0.5" style={{ color: C.muted }}>{data.senderEmail}</p>
          )}
          {data.senderPhone && (
            <p className="text-xs" style={{ color: C.muted }}>{data.senderPhone}</p>
          )}
          {data.senderAddress && (
            <p className="text-xs whitespace-pre-line mt-1" style={{ color: C.muted }}>{data.senderAddress}</p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <p
            className="text-2xl font-black tracking-[0.18em] uppercase"
            style={{ color: C.black }}
          >
            Invoice
          </p>
          <p className="text-sm font-bold mt-1" style={{ color: data.accentColor }}>
            {data.invoiceNumber || "—"}
          </p>
          <p className="text-xs mt-3" style={{ color: C.subtle }}>
            {formatDate(data.issueDate, language)}
          </p>
          {data.dueDate && (
            <p className="text-xs mt-0.5" style={{ color: C.subtle }}>
              {t.dueDate}: <span style={{ color: C.mid }}>{formatDate(data.dueDate, language)}</span>
            </p>
          )}
          <p className="text-xs mt-0.5" style={{ color: C.subtle }}>{data.currency}</p>
        </div>
      </div>

      {/* Full-width dark divider */}
      <div className="mb-8" style={{ height: "1.5px", backgroundColor: C.dark }} />

      {/* Bill To */}
      <div className="mb-10">
        <p className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: C.subtle }}>{t.billTo}</p>
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
      <table className="w-full border-collapse mb-4">
        <colgroup>
          <col style={{ width: "auto" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "23%" }} />
          <col style={{ width: "23%" }} />
        </colgroup>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.dark}` }}>
            <th className="text-left text-[9px] uppercase tracking-[0.18em] pb-2 font-semibold" style={{ color: C.subtle }}>{t.description}</th>
            <th className="text-center text-[9px] uppercase tracking-[0.18em] pb-2 font-semibold" style={{ color: C.subtle }}>{t.qty}</th>
            <th className="text-right text-[9px] uppercase tracking-[0.18em] pb-2 font-semibold" style={{ color: C.subtle }}>{t.rate}</th>
            <th className="text-right text-[9px] uppercase tracking-[0.18em] pb-2 font-semibold" style={{ color: C.subtle }}>{t.amount}</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr
              key={item.id}
              style={{ borderBottom: `1px solid ${idx < data.items.length - 1 ? C.divider : "transparent"}` }}
            >
              <td className="py-3 pr-3 text-sm align-top" style={{ color: C.dark }}>
                {item.description || <span className="italic text-xs" style={{ color: C.faint }}>{t.noDescription}</span>}
              </td>
              <td className="py-3 text-center text-sm align-top" style={{ color: C.muted }}>{item.quantity}</td>
              <td className="py-3 text-right text-sm tabular-nums align-top whitespace-nowrap" style={{ color: C.muted }}>{fmt(item.rate)}</td>
              <td className="py-3 text-right text-sm tabular-nums align-top whitespace-nowrap font-medium" style={{ color: C.dark }}>{fmt(item.quantity * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dark divider above totals */}
      <div className="mb-5" style={{ height: "1.5px", backgroundColor: C.dark }} />

      {/* Totals */}
      <div className="flex justify-end mb-8">
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
            className="flex justify-between gap-6 pt-3 font-black text-base"
            style={{ color: C.black, borderTop: `1px solid ${C.dark}` }}
          >
            <span className="whitespace-nowrap">{t.totalDue}</span>
            <span className="tabular-nums whitespace-nowrap" style={{ color: data.accentColor }}>{fmt(total)}</span>
          </div>
        </div>
      </div>

      {/* Payment Details + QR */}
      {(data.paymentDetails || data.qrUrl) && (
        <>
          <div className="mb-5" style={{ height: "1px", backgroundColor: C.divider }} />
          <div className="mb-5 flex justify-between items-start gap-6">
            {data.paymentDetails && (
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: C.subtle }}>{t.paymentDetails}</p>
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
          <div className="mb-5" style={{ height: "1px", backgroundColor: C.divider }} />
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: C.subtle }}>{t.notes}</p>
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
  );
}
