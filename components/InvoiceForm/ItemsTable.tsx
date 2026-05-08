"use client";

import { Plus, Trash2 } from "lucide-react";
import { InvoiceData, InvoiceItem, CURRENCIES } from "@/types/invoice";
import { calcLineTotal, formatCurrency } from "@/lib/calculations";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import NumberInput from "@/components/ui/NumberInput";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function ItemsTable({ data, onChange }: Props) {
  const { t } = useLanguage();
  const currencySymbol = CURRENCIES.find((c) => c.code === data.currency)?.symbol ?? "$";

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      rate: 0,
    };
    onChange({ items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return;
    onChange({ items: data.items.filter((item) => item.id !== id) });
  };

  const updateItem = (
    id: string,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => {
    onChange({
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  };

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-sm text-white placeholder:text-white/25 focus:border-indigo-500/60 transition-colors duration-200";

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest pl-3 border-l-2 border-emerald-500/50">
        {t.lineItems}
      </h3>

      {/* Column headers */}
      <div
        className="grid gap-2 text-[10px] font-semibold text-white/30 uppercase tracking-wider px-1"
        style={{ gridTemplateColumns: "1fr 64px 88px 84px 32px" }}
      >
        <span>{t.description}</span>
        <span className="text-center">{t.qty}</span>
        <span className="text-center">{t.rate}</span>
        <span className="text-right">{t.amount}</span>
        <span />
      </div>

      {/* Item rows */}
      <div className="flex flex-col gap-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="grid gap-2 items-center"
            style={{ gridTemplateColumns: "1fr 64px 88px 84px 32px" }}
          >
            <input
              className={inputBase}
              placeholder={t.phItemDescription}
              value={item.description}
              onChange={(e) => updateItem(item.id, "description", e.target.value)}
            />

            <NumberInput
              value={item.quantity}
              onChange={(v) => updateItem(item.id, "quantity", v)}
              className={`${inputBase} text-center`}
              placeholder="1"
            />

            <NumberInput
              value={item.rate}
              onChange={(v) => updateItem(item.id, "rate", v)}
              className={`${inputBase} text-center`}
              placeholder="0.00"
            />

            <div className="text-right text-sm font-medium text-white/60 tabular-nums truncate">
              {formatCurrency(calcLineTotal(item), currencySymbol)}
            </div>

            <button
              onClick={() => removeItem(item.id)}
              disabled={data.items.length === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <Button variant="ghost" size="sm" onClick={addItem} className="self-start mt-1">
        <Plus size={14} />
        {t.addItem}
      </Button>
    </div>
  );
}
