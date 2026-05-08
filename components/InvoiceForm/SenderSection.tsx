"use client";

import { useRef, useState, useEffect } from "react";
import { Upload, X, Save, RotateCcw, Check } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { saveSenderProfile, loadSenderProfile } from "@/lib/senderProfile";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function SenderSection({ data, onChange }: Props) {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    setHasSaved(loadSenderProfile() !== null);
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ logoUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    saveSenderProfile({
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      senderPhone: data.senderPhone,
      senderAddress: data.senderAddress,
      logoUrl: data.logoUrl,
    });
    setHasSaved(true);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  const handleLoadProfile = () => {
    const profile = loadSenderProfile();
    if (profile) {
      onChange({
        senderName: profile.senderName,
        senderEmail: profile.senderEmail,
        senderPhone: profile.senderPhone,
        senderAddress: profile.senderAddress,
        logoUrl: profile.logoUrl,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest pl-3 border-l-2 border-emerald-500/50">
          {t.from}
        </h3>
        <div className="flex items-center gap-2">
          {hasSaved && (
            <button
              onClick={handleLoadProfile}
              className="flex items-center gap-1 text-[10px] text-white/35 hover:text-white/60 transition-colors"
            >
              <RotateCcw size={10} />
              Load saved
            </button>
          )}
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-1 text-[10px] text-white/35 hover:text-emerald-400 transition-colors"
          >
            {savedFlash ? <Check size={10} /> : <Save size={10} />}
            {savedFlash ? "Saved!" : "Save info"}
          </button>
        </div>
      </div>

      {/* Logo + business name row */}
      <div className="flex items-end gap-3">
        {data.logoUrl ? (
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
            <img
              src={data.logoUrl}
              alt="Company logo"
              className="w-full h-full object-contain bg-white/5"
            />
            <button
              onClick={() => onChange({ logoUrl: null })}
              className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/80 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <X size={9} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-14 h-14 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-1 text-white/30 hover:border-emerald-500/50 hover:text-emerald-400 transition-all duration-200 flex-shrink-0"
          >
            <Upload size={14} />
            <span className="text-[8px] font-semibold uppercase tracking-wide">Logo</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
        <div className="flex-1">
          <Input
            label={t.businessName}
            placeholder={t.phBusinessName}
            value={data.senderName}
            onChange={(e) => onChange({ senderName: e.target.value })}
          />
        </div>
      </div>

      <Input
        label={t.email}
        type="email"
        placeholder={t.phSenderEmail}
        value={data.senderEmail}
        onChange={(e) => onChange({ senderEmail: e.target.value })}
      />

      <Input
        label={t.phone}
        type="tel"
        placeholder={t.phPhone}
        value={data.senderPhone}
        onChange={(e) => onChange({ senderPhone: e.target.value })}
      />

      <Textarea
        label={t.address}
        placeholder={t.phSenderAddress}
        value={data.senderAddress}
        onChange={(e) => onChange({ senderAddress: e.target.value })}
        rows={3}
      />
    </div>
  );
}
