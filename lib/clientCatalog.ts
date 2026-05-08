const KEY = "client_catalog";
const MAX = 100;

export interface ClientEntry {
  id: string;
  name: string;
  email: string;
  address: string;
}

export function loadClients(): ClientEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveClient(name: string, email: string, address: string): void {
  const clients = loadClients();
  const existing = clients.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    existing.email = email;
    existing.address = address;
  } else {
    clients.unshift({ id: crypto.randomUUID(), name, email, address });
  }
  localStorage.setItem(KEY, JSON.stringify(clients.slice(0, MAX)));
}

export function removeClient(id: string): void {
  localStorage.setItem(
    KEY,
    JSON.stringify(loadClients().filter((c) => c.id !== id))
  );
}
