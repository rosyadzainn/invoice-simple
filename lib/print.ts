import { InvoiceData, CURRENCIES } from "@/types/invoice";
import { calcSubtotal, calcDiscount, calcTax, calcTotal, formatCurrency } from "./calculations";
import { Translations, Language, formatDate } from "./i18n";

// Escape user-supplied strings so they render as plain text, not HTML.
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br/>");
}

export function printInvoice(
  data: InvoiceData,
  t: Translations,
  language: Language
): void {
  const currency = CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0];
  const subtotal  = calcSubtotal(data.items);
  const discount  = calcDiscount(subtotal, data.discount);
  const tax       = calcTax(subtotal - discount, data.taxRate);
  const total     = calcTotal(subtotal, discount, tax);
  const fmt = (n: number) => formatCurrency(n, currency.symbol);

  const itemRows = data.items
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

  const discountRow =
    data.discount > 0
      ? `<tr>
          <td colspan="2"></td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.discount} (${data.discount}%)</td>
          <td style="padding:4px 0;text-align:right;color:#ef4444;font-size:12px;white-space:nowrap">−${esc(fmt(discount))}</td>
        </tr>`
      : "";

  const taxRow =
    data.taxRate > 0
      ? `<tr>
          <td colspan="2"></td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${t.taxRate} (${data.taxRate}%)</td>
          <td style="padding:4px 0;text-align:right;color:#6b7280;font-size:12px;white-space:nowrap">${esc(fmt(tax))}</td>
        </tr>`
      : "";

  const logoHtml = data.logoUrl
    ? `<img src="${data.logoUrl}" alt="Logo" style="height:48px;width:auto;object-fit:contain;display:block;margin-bottom:12px" />`
    : "";

  const dueDateRow = data.dueDate
    ? `<tr>
        <td style="font-size:11px;color:#9ca3af;padding:2px 16px 2px 0;white-space:nowrap">${t.dueDate}</td>
        <td style="font-size:11px;color:#ef4444;font-weight:600;text-align:right">${formatDate(data.dueDate, language)}</td>
      </tr>`
    : "";

  const notesHtml = data.notes
    ? `<div style="margin-top:32px;padding-top:24px;border-top:1px solid #f3f4f6">
        <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#9ca3af;margin-bottom:8px">${t.notes}</p>
        <p style="font-size:12px;color:#6b7280;line-height:1.7">${esc(data.notes)}</p>
      </div>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${esc(data.invoiceNumber)}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;background:#fff}
    @page{margin:.65in;size:A4 portrait}
    @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
  </style>
</head>
<body>
  <div style="height:5px;background:${data.accentColor}"></div>
  <div style="max-width:700px;margin:0 auto;padding:48px">

    <!-- Header -->
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

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #f3f4f6;margin-bottom:32px"/>

    <!-- Bill To -->
    <div style="margin-bottom:32px">
      <p style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;color:#9ca3af;margin-bottom:8px">${t.billTo}</p>
      <p style="font-size:14px;font-weight:700;color:#111827">${esc(data.clientName || t.phClientName)}</p>
      ${data.clientEmail ? `<p style="font-size:12px;color:#6b7280;margin-top:2px">${esc(data.clientEmail)}</p>` : ""}
      ${data.clientAddress ? `<p style="font-size:12px;color:#6b7280;margin-top:4px;line-height:1.5">${esc(data.clientAddress)}</p>` : ""}
    </div>

    <!-- Line Items -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:32px">
      <thead>
        <tr style="border-bottom:2px solid ${data.accentColor}">
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:left;padding-bottom:8px">${t.description}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:center;padding-bottom:8px;width:56px">${t.qty}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.rate}</th>
          <th style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af;text-align:right;padding-bottom:8px;width:100px">${t.amount}</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
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
          <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:15px;color:#111827;border-top:2px solid ${data.accentColor};white-space:nowrap">${t.totalDue}</td>
          <td style="padding:10px 0 4px;text-align:right;font-weight:900;font-size:15px;color:#111827;border-top:2px solid ${data.accentColor};white-space:nowrap">${esc(fmt(total))}</td>
        </tr>
      </tfoot>
    </table>

    ${notesHtml}

    <!-- Footer -->
    <div style="margin-top:40px;padding-top:16px;border-top:1px solid #f3f4f6;display:flex;justify-content:space-between">
      <p style="font-size:10px;color:#d1d5db">${t.thankYou}</p>
      <p style="font-size:10px;color:#d1d5db">Simple</p>
    </div>

  </div>
</body>
</html>`;

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
