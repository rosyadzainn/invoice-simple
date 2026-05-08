"use client";

import { useState } from "react";
import { Save, Check, UserPlus } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { loadClients, saveClient, ClientEntry } from "@/lib/clientCatalog";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function ClientSection({ data, onChange }: Props) {
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const [clients, setClients] = useState<ClientEntry[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  const getSuggestions = (query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return clients.slice(0, 6);
    return clients.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  };

  const handleNameFocus = () => {
    setClients(loadClients());
    setShowDropdown(true);
  };

  const handleNameBlur = () => {
    setTimeout(() => setShowDropdown(false), 160);
  };

  const handleSelect = (client: ClientEntry) => {
    onChange({
      clientName: client.name,
      clientEmail: client.email,
      clientAddress: client.address,
    });
    setShowDropdown(false);
  };

  const handleSave = () => {
    if (!data.clientName) return;
    saveClient(data.clientName, data.clientEmail, data.clientAddress);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const suggestions = getSuggestions(data.clientName);

  const inputBase =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-indigo-500/60 focus:bg-white/8 transition-colors duration-200";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest pl-3 border-l-2 border-emerald-500/50">
          {t.billTo}
        </h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-1 text-[10px] text-white/35 hover:text-emerald-400 transition-colors"
        >
          {savedFlash ? <Check size={10} /> : <Save size={10} />}
          {savedFlash ? "Saved!" : "Save client"}
        </button>
      </div>

      {/* Client name with autocomplete */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-white/50 font-medium uppercase tracking-wider">
          {t.clientName}
        </label>
        <div className="relative">
          <input
            className={inputBase}
            placeholder={t.phClientName}
            value={data.clientName}
            onChange={(e) => onChange({ clientName: e.target.value })}
            onFocus={handleNameFocus}
            onBlur={handleNameBlur}
          />

          {showDropdown && clients.length > 0 && suggestions.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg overflow-hidden"
              style={{
                background: "rgba(18,18,18,0.98)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div className="px-3 py-1.5 flex items-center gap-1.5 border-b border-white/5">
                <UserPlus size={10} className="text-white/30" />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">Saved clients</span>
              </div>
              {suggestions.map((client) => (
                <button
                  key={client.id}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(client); }}
                  className="w-full flex flex-col px-3 py-2.5 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
                >
                  <span className="text-sm text-white/80 font-medium">{client.name}</span>
                  {client.email && (
                    <span className="text-xs text-white/35 mt-0.5">{client.email}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <Input
        label={t.email}
        type="email"
        placeholder={t.phClientEmail}
        value={data.clientEmail}
        onChange={(e) => onChange({ clientEmail: e.target.value })}
      />

      <Textarea
        label={t.address}
        placeholder={t.phClientAddress}
        value={data.clientAddress}
        onChange={(e) => onChange({ clientAddress: e.target.value })}
        rows={3}
      />
    </div>
  );
}
