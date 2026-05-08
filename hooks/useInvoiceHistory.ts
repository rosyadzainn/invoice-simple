"use client";

import { useState, useEffect, useCallback } from "react";
import { InvoiceData } from "@/types/invoice";

const STORAGE_KEY = "simple_invoices";
const OLD_KEY = "simple_invoice";
export const MAX_HISTORY = 30;

export interface SavedInvoice {
  id: string;
  data: InvoiceData;
  createdAt: string;
  updatedAt: string;
}

export function useInvoiceHistory(defaultData: InvoiceData) {
  const [list, setList] = useState<SavedInvoice[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: SavedInvoice[] = JSON.parse(raw);
        if (parsed.length > 0) {
          setList(parsed);
          setActiveId(parsed[0].id);
          setReady(true);
          return;
        }
      } catch {}
    }

    // Migrate from old single-invoice key, or start fresh
    let data = { ...defaultData };
    try {
      const old = localStorage.getItem(OLD_KEY);
      if (old) {
        data = { ...defaultData, ...JSON.parse(old) };
        localStorage.removeItem(OLD_KEY);
      }
    } catch {}

    const first: SavedInvoice = {
      id: crypto.randomUUID(),
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const initial = [first];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    setList(initial);
    setActiveId(first.id);
    setReady(true);
  }, []);

  const activeData: InvoiceData =
    list.find((e) => e.id === activeId)?.data ?? defaultData;

  const update = useCallback(
    (data: InvoiceData) => {
      const now = new Date().toISOString();
      setList((prev) => {
        const next = prev.map((e) =>
          e.id === activeId ? { ...e, data, updatedAt: now } : e
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [activeId]
  );

  const createNew = useCallback((data: InvoiceData) => {
    const entry: SavedInvoice = {
      id: crypto.randomUUID(),
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setList((prev) => {
      const next = [entry, ...prev].slice(0, MAX_HISTORY);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setActiveId(entry.id);
  }, []);

  const loadEntry = useCallback(
    (id: string): InvoiceData | null => {
      const found = list.find((e) => e.id === id);
      if (!found) return null;
      setActiveId(id);
      return found.data;
    },
    [list]
  );

  const removeEntry = useCallback(
    (id: string) => {
      const next = list.filter((e) => e.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setList(next);
      if (id === activeId && next.length > 0) setActiveId(next[0].id);
    },
    [activeId, list]
  );

  return { list, activeId, activeData, ready, update, createNew, loadEntry, removeEntry };
}
