const KEY = "item_catalog";
const MAX  = 50;

export interface CatalogItem {
  id: string;
  description: string;
  rate: number;
}

export function loadCatalog(): CatalogItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToCatalog(description: string, rate: number): void {
  const catalog = loadCatalog();
  const existing = catalog.find(
    (i) => i.description.toLowerCase() === description.toLowerCase()
  );
  if (existing) {
    existing.rate = rate;
  } else {
    catalog.unshift({ id: crypto.randomUUID(), description, rate });
  }
  localStorage.setItem(KEY, JSON.stringify(catalog.slice(0, MAX)));
}

export function removeFromCatalog(id: string): void {
  localStorage.setItem(
    KEY,
    JSON.stringify(loadCatalog().filter((i) => i.id !== id))
  );
}
