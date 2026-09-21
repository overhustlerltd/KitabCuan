// Lookup lokasi kota dari IP (untuk notif pembelian). Gratis, tanpa key (ipwho.is).

export async function lookupLocation(ip?: string): Promise<string | undefined> {
  if (!ip) return undefined;
  // abaikan IP lokal/private
  if (/^(10\.|127\.|192\.168\.|::1|localhost)/.test(ip)) return undefined;
  try {
    const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,city,region,country`, {
      cache: "no-store",
    });
    if (!res.ok) return undefined;
    const j = (await res.json()) as {
      success?: boolean;
      city?: string;
      region?: string;
      country?: string;
    };
    if (!j.success) return undefined;
    const parts = [j.city, j.region].filter(Boolean);
    const loc = parts.join(", ");
    return loc || j.country || undefined;
  } catch {
    return undefined;
  }
}
