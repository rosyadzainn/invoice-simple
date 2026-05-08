"use client";

import { X, Trash2, Copy } from "lucide-react";
import { SavedInvoice, MAX_HISTORY } from "@/hooks/useInvoiceHistory";
import { CURRENCIES, InvoiceStatus } from "@/types/invoice";
import { calcSubtotal, calcDiscount, calcTax, calcTotal, formatCurrency } from "@/lib/calculations";

interface Props {
  list: SavedInvoice[];
  activeId: string;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onClose: () => void;
}

function invoiceTotal(entry: SavedInvoice): string {
  const { items, discount, taxRate, currency } = entry.data;
  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];
  const sub  = calcSubtotal(items);
  const disc = calcDiscount(sub, discount);
  const tax  = calcTax(sub - disc, taxRate);
  return formatCurrency(calcTotal(sub, disc, tax), cur.symbol);
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`;
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

const STATUS_DOT: Record<InvoiceStatus, string> = {
  unpaid:  "#6b7280",
  paid:    "#10b981",
  overdue: "#ef4444",
};

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  unpaid:  "Unpaid",
  paid:    "Paid",
  overdue: "Overdue",
};

export default function InvoiceHistory({ list, activeId, onLoad, onDelete, onDuplicate, onClose }: Props) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col"
        style={{
          background: "rgba(10,10,10,0.98)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "12px 0 40px rgba(0,0,0,0.7)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <span className="text-sm font-semibold text-white">Invoice History</span>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-1">
          {list.map((entry) => {
            const isActive = entry.id === activeId;
            const status = entry.data.status ?? "unpaid";
            return (
              <div
                key={entry.id}
                onClick={() => onLoad(entry.id)}
                className="group relative px-5 py-3.5 cursor-pointer transition-colors duration-150"
                style={{
                  background: isActive ? "rgba(16,185,129,0.08)" : undefined,
                  borderLeft: isActive ? "2px solid #10b981" : "2px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.background = "";
                }}
              >
                <div className="flex items-start justify-between gap-2 pr-14">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: STATUS_DOT[status] }}
                        title={STATUS_LABEL[status]}
                      />
                      <p className="text-sm font-semibold text-white truncate">
                        {entry.data.invoiceNumber || "No number"}
                      </p>
                    </div>
                    <p className="text-xs text-white/40 truncate mt-0.5 pl-3">
                      {entry.data.clientName || "No client"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-emerald-400 tabular-nums">
                      {invoiceTotal(entry)}
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      {relativeTime(entry.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Action buttons (visible on hover) */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button
                    onClick={(e) => { e.stopPropagation(); onDuplicate(entry.id); }}
                    className="p-1.5 rounded text-white/30 hover:text-emerald-400 transition-colors"
                    title="Duplicate"
                  >
                    <Copy size={13} />
                  </button>
                  {list.length > 1 && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                      className="p-1.5 rounded text-white/30 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[10px] text-white/20 text-center">
            {list.length} / {MAX_HISTORY} invoices saved
          </p>
        </div>
      </div>
    </>
  );
}
