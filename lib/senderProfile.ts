const KEY = "sender_profile";

export interface SenderProfile {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  logoUrl: string | null;
}

export function saveSenderProfile(p: SenderProfile): void {
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function loadSenderProfile(): SenderProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
