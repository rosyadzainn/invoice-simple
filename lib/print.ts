import { InvoiceData, CURRENCIES } from "@/types/invoice";
import { calcSubtotal, calcDiscount, calcTax, calcTotal, formatCurrency } from "./calculations";
import { Translations, Language, formatDate } from "./i18n";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

const BASE_STYLE = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;background:#fff}
  @page{margin:.65in;size:A4 portrait}
  @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
`;

function buildItemRows(data: InvoiceData, fmt: (n: number) => string): string {
  return data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#1f2937;font-size:13px">${esc(item.description) || "—"}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:center;color:#6b7280;font-size:13px">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;color:#6b7280;font-size:13px;white-space:nowrap">${esc(fmt(item.rate))}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-weight:600;color:#1f2937;font-size:13px;white-space:nowrap">${esc(fmt(item.quantity * item.rate))}</td>
      </tr>`
    )
    .join("");
}

function buildTotalsRows(
  data: InvoiceData,
  t: Translations,
  subtotal: number,
  discount: number,
  tax: number,
  total: number,
  fmt: (n: number) => string,
  borderColor: string
): string {
  const discountRow = data.discount > 0
    ? `<tr>
        <td colspan="2"></td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.discount} (${data.discount}%)</td>
        <td style="padding:4px 0;text-align:right;color:#ef4444;font-size:12px;white-space:nowrap">−${esc(fmt(discount))}</td>
      </tr>` : "";

  const taxRow = data.taxRate > 0
    ? `<tr>
        <td colspan="2"></td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.taxRate} (${data.taxRate}%)</td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${esc(fmt(tax))}</td>
      </tr>` : "";

  return `
    <tfoot>
      <tr>
        <td colspan="2"></td>
        <td style="padding:12px 0 4px;text-align:right;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;white-space:nowrap">${t.subtotal}</td>
        <td style="padding:12px 0 4px;text-align:right;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb;white-space:nowrap">${esc(fmt(subtotal))}</td>
      </tr>
      ${discountRow}
      ${taxRow}
      <tr>
        <td colspan="2"></td>
        <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:15px;color:#111827;border-top:2px solid ${borderColor};white-space:nowrap">${t.totalDue}</td>
        <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:15px;color:#111827;border-top:2px solid ${borderColor};white-space:nowrap">${esc(fmt(total))}</td>
      </tr>
    </tfoot>`;
}

function buildStamp(data: InvoiceData): string {
  if (!data.status || data.status === "unpaid") return "";
  const color = data.status === "paid" ? "#10b981" : "#ef4444";
  const text  = data.status === "paid" ? "PAID" : "OVERDUE";
  return `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-22deg);border:5px solid ${color};border-radius:8px;padding:10px 36px;color:${color};font-size:52px;font-weight:900;letter-spacing:.15em;opacity:.22;pointer-events:none;z-index:999;font-family:Arial,sans-serif;white-space:nowrap;">${text}</div>`;
}

function buildPaymentNotes(data: InvoiceData, t: Translations): string {
  const qrHtml = data.qrUrl
    ? `<img src="${data.qrUrl}" alt="QR" style="width:80px;height:80px;object-fit:contain;display:block;flex-shrink:0" />`
    : "";

  const paymentHtml = (data.paymentDetails || data.qrUrl)
    ? `<div style="margin-top:32px;padding-top:24px;border-top:1px solid #f3f4f6;display:flex;justify-content:space-between;align-items:flex-start;gap:24px">
        ${data.paymentDetails ? `<div style="flex:1;min-width:0">
          <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#9ca3af;margin-bottom:8px">${t.paymentDetails}</p>
          <p style="font-size:12px;color:#6b7280;line-height:1.7">${esc(data.paymentDetails)}</p>
        </div>` : ""}
        ${qrHtml}
      </div>` : "";

  const notesHtml = data.notes
    ? `<div style="margin-top:32px;padding-top:24px;border-top:1px solid #f3f4f6">
        <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#9ca3af;margin-bottom:8px">${t.notes}</p>
        <p style="font-size:12px;color:#6b7280;line-height:1.7">${esc(data.notes)}</p>
      </div>` : "";

  const signatureHtml = data.signatureUrl
    ? `<div style="display:flex;flex-direction:column;align-items:flex-end;margin-top:40px">
        <img src="${data.signatureUrl}" alt="Signature" style="max-height:56px;width:auto;object-fit:contain;display:block" />
        <div style="width:160px;border-top:1px solid #d1d5db;padding-top:4px;margin-top:4px;text-align:right">
          <p style="font-size:9px;text-transform:uppercase;letter-spacing:.15em;color:#9ca3af">Authorized Signature</p>
        </div>
      </div>` : "";

  return paymentHtml + notesHtml + signatureHtml;
}

// ── Simple ──────────────────────────────────────────────────────────────────

function buildSimpleHtml(data: InvoiceData, t: Translations, language: Language): string {
  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal = calcSubtotal(data.items);
  const discount = calcDiscount(subtotal, data.discount);
  const tax      = calcTax(subtotal - discount, data.taxRate);
  const total    = calcTotal(subtotal, discount, tax);
  const fmt      = (n: number) => formatCurrency(n, currency.symbol);

  const logoHtml = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="Logo" style="height:44px;width:auto;object-fit:contain;display:block;margin-bottom:12px" />`
    : "";

  const dueDateRow = data.dueDate
    ? `<tr>
        <td style="font-size:11px;color:#9ca3af;padding:2px 16px 2px 0;white-space:nowrap">${t.dueDate}</td>
        <td style="font-size:11px;color:#ef4444;font-weight:600;text-align:right">${formatDate(data.dueDate, language)}</td>
      </tr>` : "";

  return `<!DOCTYPE html>
<html lang="${language}">
<head><meta charset="UTF-8"/><title>Invoice ${esc(data.invoiceNumber)}</title>
<style>${BASE_STYLE}</style></head>
<body>
  ${buildStamp(data)}
  <div style="height:5px;background:${data.accentColor}"></div>
  <div style="max-width:700px;margin:0 auto;padding:48px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
      <div style="max-width:55%">
        ${logoHtml}
        <p style="font-size:18px;font-weight:700;color:#111827">${esc(data.senderName || t.phBusinessName)}</p>
        ${data.senderEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:4px">${esc(data.senderEmail)}</p>` : ""}
        ${data.senderPhone ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.senderPhone)}</p>` : ""}
        ${data.senderAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.senderAddress)}</p>` : ""}
      </div>
      <div style="text-align:right">
        <h1 style="font-size:42px;font-weight:900;color:#111827;letter-spacing:-1px;margin-bottom:16px">INVOICE</h1>
        <table style="margin-left:auto;border-collapse:collapse">
          <tr>
            <td style="font-size:11px;color:#9ca3af;padding:2px 16px 2px 0;white-space:nowrap">${t.number}</td>
            <td style="font-size:11px;color:#1f2937;font-weight:700;text-align:right">${esc(data.invoiceNumber || "—")}</td>
          </tr>
          <tr>
            <td style="font-size:11px;color:#9ca3af;padding:2px 16px 2px 0;white-space:nowrap">${t.issueDate}</td>
            <td style="font-size:11px;color:#374151;text-align:right">${formatDate(data.issueDate, language)}</td>
          </tr>
          ${dueDateRow}
          <tr>
            <td style="font-size:11px;color:#9ca3af;padding:2px 16px 2px 0;white-space:nowrap">${t.currency}</td>
            <td style="font-size:11px;color:#374151;text-align:right">${data.currency}</td>
          </tr>
        </table>
      </div>
    </div>
    <hr style="border:none;border-top:1px solid #f3f4f6;margin-bottom:32px"/>
    <div style="margin-bottom:32px">
      <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9ca3af;margin-bottom:8px">${t.billTo}</p>
      <p style="font-size:14px;font-weight:700;color:#111827">${esc(data.clientName || t.phClientName)}</p>
      ${data.clientEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.clientEmail)}</p>` : ""}
      ${data.clientAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.clientAddress)}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr style="border-bottom:2px solid ${data.accentColor}">
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:left;padding-bottom:8px">${t.description}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:center;padding-bottom:8px;width:56px">${t.qty}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.rate}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.amount}</th>
        </tr>
      </thead>
      <tbody>${buildItemRows(data, fmt)}</tbody>
      ${buildTotalsRows(data, t, subtotal, discount, tax, total, fmt, data.accentColor)}
    </table>
    ${buildPaymentNotes(data, t)}
  </div>
</body></html>`;
}

// ── Modern ───────────────────────────────────────────────────────────────────

function buildModernHtml(data: InvoiceData, t: Translations, language: Language): string {
  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal = calcSubtotal(data.items);
  const discount = calcDiscount(subtotal, data.discount);
  const tax      = calcTax(subtotal - discount, data.taxRate);
  const total    = calcTotal(subtotal, discount, tax);
  const fmt      = (n: number) => formatCurrency(n, currency.symbol);

  const logoHtml = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="Logo" style="height:44px;width:auto;object-fit:contain;display:block;margin-bottom:12px" />`
    : "";

  const dueDateRow = data.dueDate
    ? `<tr>
        <td style="font-size:11px;color:rgba(255,255,255,.6);padding:2px 16px 2px 0;white-space:nowrap">${t.dueDate}</td>
        <td style="font-size:11px;color:rgba(255,255,255,.95);font-weight:600;text-align:right">${formatDate(data.dueDate, language)}</td>
      </tr>` : "";

  return `<!DOCTYPE html>
<html lang="${language}">
<head><meta charset="UTF-8"/><title>Invoice ${esc(data.invoiceNumber)}</title>
<style>${BASE_STYLE}</style></head>
<body>
  ${buildStamp(data)}
  <div style="max-width:700px;margin:0 auto">
    <!-- Colored header -->
    <div style="background:${data.accentColor};padding:40px 48px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="max-width:55%">
          ${logoHtml}
          <p style="font-size:18px;font-weight:700;color:rgba(255,255,255,.95)">${esc(data.senderName || t.phBusinessName)}</p>
          ${data.senderEmail ? `<p style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px">${esc(data.senderEmail)}</p>` : ""}
          ${data.senderPhone ? `<p style="font-size:12px;color:rgba(255,255,255,.7);margin-top:2px">${esc(data.senderPhone)}</p>` : ""}
          ${data.senderAddress ? `<p style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px;line-height:1.5">${esc(data.senderAddress)}</p>` : ""}
        </div>
        <div style="text-align:right">
          <h1 style="font-size:42px;font-weight:900;color:rgba(255,255,255,.95);letter-spacing:-1px;margin-bottom:16px">INVOICE</h1>
          <table style="margin-left:auto;border-collapse:collapse">
            <tr>
              <td style="font-size:11px;color:rgba(255,255,255,.6);padding:2px 16px 2px 0;white-space:nowrap">${t.number}</td>
              <td style="font-size:11px;color:rgba(255,255,255,.95);font-weight:700;text-align:right">${esc(data.invoiceNumber || "—")}</td>
            </tr>
            <tr>
              <td style="font-size:11px;color:rgba(255,255,255,.6);padding:2px 16px 2px 0;white-space:nowrap">${t.issueDate}</td>
              <td style="font-size:11px;color:rgba(255,255,255,.85);text-align:right">${formatDate(data.issueDate, language)}</td>
            </tr>
            ${dueDateRow}
            <tr>
              <td style="font-size:11px;color:rgba(255,255,255,.6);padding:2px 16px 2px 0;white-space:nowrap">${t.currency}</td>
              <td style="font-size:11px;color:rgba(255,255,255,.85);text-align:right">${data.currency}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
    <!-- White body -->
    <div style="padding:40px 48px">
      <div style="margin-bottom:32px">
        <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9ca3af;margin-bottom:8px">${t.billTo}</p>
        <p style="font-size:14px;font-weight:700;color:#111827">${esc(data.clientName || t.phClientName)}</p>
        ${data.clientEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.clientEmail)}</p>` : ""}
        ${data.clientAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.clientAddress)}</p>` : ""}
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
        <thead>
          <tr style="border-bottom:2px solid ${data.accentColor}">
            <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:left;padding-bottom:8px">${t.description}</th>
            <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:center;padding-bottom:8px;width:56px">${t.qty}</th>
            <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.rate}</th>
            <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.amount}</th>
          </tr>
        </thead>
        <tbody>${buildItemRows(data, fmt)}</tbody>
        ${buildTotalsRows(data, t, subtotal, discount, tax, total, fmt, data.accentColor)}
      </table>
      ${buildPaymentNotes(data, t)}
    </div>
  </div>
</body></html>`;
}

// ── Minimal ──────────────────────────────────────────────────────────────────

function buildMinimalHtml(data: InvoiceData, t: Translations, language: Language): string {
  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal = calcSubtotal(data.items);
  const discount = calcDiscount(subtotal, data.discount);
  const tax      = calcTax(subtotal - discount, data.taxRate);
  const total    = calcTotal(subtotal, discount, tax);
  const fmt      = (n: number) => formatCurrency(n, currency.symbol);

  const logoHtml = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="Logo" style="height:44px;width:auto;object-fit:contain;display:block;margin-bottom:16px" />`
    : "";

  const discountRow = data.discount > 0
    ? `<tr>
        <td colspan="2"></td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.discount} (${data.discount}%)</td>
        <td style="padding:4px 0;text-align:right;color:#ef4444;font-size:12px;white-space:nowrap">−${esc(fmt(discount))}</td>
      </tr>` : "";

  const taxRow = data.taxRate > 0
    ? `<tr>
        <td colspan="2"></td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.taxRate} (${data.taxRate}%)</td>
        <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${esc(fmt(tax))}</td>
      </tr>` : "";

  return `<!DOCTYPE html>
<html lang="${language}">
<head><meta charset="UTF-8"/><title>Invoice ${esc(data.invoiceNumber)}</title>
<style>${BASE_STYLE}</style></head>
<body>
  ${buildStamp(data)}
  <div style="max-width:700px;margin:0 auto;padding:56px 48px">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px">
      <div style="max-width:55%">
        ${logoHtml}
        <p style="font-size:17px;font-weight:700;color:#111827">${esc(data.senderName || t.phBusinessName)}</p>
        ${data.senderEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:4px">${esc(data.senderEmail)}</p>` : ""}
        ${data.senderPhone ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.senderPhone)}</p>` : ""}
        ${data.senderAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.senderAddress)}</p>` : ""}
      </div>
      <div style="text-align:right">
        <p style="font-size:22px;font-weight:900;color:#111827;letter-spacing:.18em;text-transform:uppercase">Invoice</p>
        <p style="font-size:14px;font-weight:700;color:${data.accentColor};margin-top:4px">${esc(data.invoiceNumber || "—")}</p>
        <p style="font-size:11px;color:#9ca3af;margin-top:12px">${formatDate(data.issueDate, language)}</p>
        ${data.dueDate ? `<p style="font-size:11px;color:#9ca3af;margin-top:2px">${t.dueDate}: ${formatDate(data.dueDate, language)}</p>` : ""}
        <p style="font-size:11px;color:#9ca3af;margin-top:2px">${data.currency}</p>
      </div>
    </div>
    <div style="border-top:1.5px solid #1f2937;margin-bottom:32px"></div>
    <div style="margin-bottom:36px">
      <p style="font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#9ca3af;margin-bottom:8px">${t.billTo}</p>
      <p style="font-size:14px;font-weight:700;color:#111827">${esc(data.clientName || t.phClientName)}</p>
      ${data.clientEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.clientEmail)}</p>` : ""}
      ${data.clientAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.clientAddress)}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
      <thead>
        <tr style="border-bottom:1px solid #1f2937">
          <th style="font-size:9px;text-transform:uppercase;letter-spacing:.18em;color:#9ca3af;text-align:left;padding-bottom:8px;font-weight:600">${t.description}</th>
          <th style="font-size:9px;text-transform:uppercase;letter-spacing:.18em;color:#9ca3af;text-align:center;padding-bottom:8px;width:56px;font-weight:600">${t.qty}</th>
          <th style="font-size:9px;text-transform:uppercase;letter-spacing:.18em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px;font-weight:600">${t.rate}</th>
          <th style="font-size:9px;text-transform:uppercase;letter-spacing:.18em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px;font-weight:600">${t.amount}</th>
        </tr>
      </thead>
      <tbody>${buildItemRows(data, fmt)}</tbody>
    </table>
    <div style="border-top:1.5px solid #1f2937;margin-bottom:16px"></div>
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <tfoot>
        <tr>
          <td colspan="2"></td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:13px;white-space:nowrap">${t.subtotal}</td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:13px;white-space:nowrap">${esc(fmt(subtotal))}</td>
        </tr>
        ${discountRow}
        ${taxRow}
        <tr>
          <td colspan="2"></td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:16px;color:${data.accentColor};border-top:1px solid #1f2937;white-space:nowrap">${t.totalDue}</td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:16px;color:${data.accentColor};border-top:1px solid #1f2937;white-space:nowrap">${esc(fmt(total))}</td>
        </tr>
      </tfoot>
    </table>
    ${buildPaymentNotes(data, t)}
  </div>
</body></html>`;
}

// ── Entry point ──────────────────────────────────────────────────────────────

export function printInvoice(data: InvoiceData, t: Translations, language: Language): void {
  const template = data.template ?? "simple";
  const html =
    template === "modern"  ? buildModernHtml(data, t, language) :
    template === "minimal" ? buildMinimalHtml(data, t, language) :
                             buildSimpleHtml(data, t, language);

  const win = window.open("", "_blank", "width=860,height=1080");
  if (!win) {
    alert("Pop-up blocked. Please allow pop-ups for this site and try again.");
    return;
  }
  win.document.write(html);
  win.document.close();
  setTimeout(() => {
    win.focus();
    win.print();
    win.close();
  }, 300);
}
