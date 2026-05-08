"use client";

import { useState } from "react";
import { Plus, Trash2, Bookmark, BookmarkCheck } from "lucide-react";
import { InvoiceData, InvoiceItem, CURRENCIES } from "@/types/invoice";
import { calcLineTotal, formatCurrency } from "@/lib/calculations";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import NumberInput from "@/components/ui/NumberInput";
import { loadCatalog, saveToCatalog, CatalogItem } from "@/lib/itemCatalog";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function ItemsTable({ data, onChange }: Props) {
  const { t } = useLanguage();
  const currencySymbol = CURRENCIES.find((c) => c.code === data.currency)?.symbol ?? "$";
  const [activeAutocomplete, setActiveAutocomplete] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

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

  const handleDescriptionFocus = (itemId: string) => {
    setCatalog(loadCatalog());
    setActiveAutocomplete(itemId);
  };

  const handleDescriptionBlur = () => {
    setTimeout(() => setActiveAutocomplete(null), 160);
  };

  const handleSelectCatalog = (itemId: string, ci: CatalogItem) => {
    onChange({
      items: data.items.map((item) =>
        item.id === itemId ? { ...item, description: ci.description, rate: ci.rate } : item
      ),
    });
    setActiveAutocomplete(null);
  };

  const handleSaveToCatalog = (item: InvoiceItem) => {
    if (!item.description) return;
    saveToCatalog(item.description, item.rate);
    setSavedItems((prev) => new Set(prev).add(item.id));
    setTimeout(() => setSavedItems((prev) => { const s = new Set(prev); s.delete(item.id); return s; }), 2000);
  };

  const getSuggestions = (desc: string) => {
    const q = desc.toLowerCase().trim();
    if (!q) return catalog.slice(0, 6);
    return catalog.filter((ci) => ci.description.toLowerCase().includes(q)).slice(0, 6);
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
        {data.items.map((item) => {
          const suggestions = getSuggestions(item.description);
          const showDropdown = activeAutocomplete === item.id && catalog.length > 0 && suggestions.length > 0;

          return (
            <div
              key={item.id}
              className="grid gap-2 items-center"
              style={{ gridTemplateColumns: "1fr 64px 88px 84px 32px" }}
            >
              {/* Description with autocomplete */}
              <div className="relative">
                <input
                  className={inputBase}
                  style={{ paddingRight: item.description ? "28px" : undefined }}
                  placeholder={t.phItemDescription}
                  value={item.description}
                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  onFocus={() => handleDescriptionFocus(item.id)}
                  onBlur={handleDescriptionBlur}
                />
                {item.description && (
                  <button
                    onMouseDown={(e) => { e.preventDefault(); handleSaveToCatalog(item); }}
                    title="Save to catalog"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-emerald-400 transition-colors"
                  >
                    {savedItems.has(item.id) ? (
                      <BookmarkCheck size={11} className="text-emerald-400" />
                    ) : (
                      <Bookmark size={11} />
                    )}
                  </button>
                )}
                {showDropdown && (
                  <div
                    className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg overflow-hidden"
                    style={{
                      background: "rgba(18,18,18,0.98)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}
                  >
                    {suggestions.map((ci) => (
                      <button
                        key={ci.id}
                        onMouseDown={(e) => { e.preventDefault(); handleSelectCatalog(item.id, ci); }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-white/5 transition-colors text-left"
                      >
                        <span className="text-white/80 truncate">{ci.description}</span>
                        <span className="text-white/35 ml-3 tabular-nums flex-shrink-0">
                          {currencySymbol}{ci.rate.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

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
          );
        })}
      </div>

      <Button variant="ghost" size="sm" onClick={addItem} className="self-start mt-1">
        <Plus size={14} />
        {t.addItem}
      </Button>
    </div>
  );
}
