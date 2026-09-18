import crypto from "crypto";

// Meta Conversions API (server-side). Kirim event Purchase terverifikasi dari
// webhook DurianPay langsung ke pixel. Semua kredensial dari env.

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || "v21.0";

function pixelId(): string | undefined {
  return process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
}

export function isCapiConfigured(): boolean {
  return Boolean(process.env.META_CAPI_TOKEN && pixelId());
}

function sha256(v: string): string {
  return crypto.createHash("sha256").update(v).digest("hex");
}

export type CapiPurchaseInput = {
  email?: string;
  phone?: string;
  name?: string;
  value: number;
  currency: string;
  eventId: string; // dedup key (pakai order ref)
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
};

export async function sendMetaCapiPurchase(
  p: CapiPurchaseInput,
): Promise<{ ok: boolean; reason?: string }> {
  const token = process.env.META_CAPI_TOKEN;
  const pid = pixelId();
  if (!token || !pid) return { ok: false, reason: "capi_not_configured" };

  const user_data: Record<string, unknown> = {};
  if (p.email) user_data.em = [sha256(p.email.trim().toLowerCase())];
  if (p.phone) user_data.ph = [sha256(p.phone.replace(/[^0-9]/g, ""))];
  if (p.name) user_data.fn = [sha256(p.name.trim().toLowerCase())];
  if (p.fbp) user_data.fbp = p.fbp;
  if (p.fbc) user_data.fbc = p.fbc;
  if (p.clientIp) user_data.client_ip_address = p.clientIp;
  if (p.userAgent) user_data.client_user_agent = p.userAgent;

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_id: p.eventId,
        ...(p.eventSourceUrl ? { event_source_url: p.eventSourceUrl } : {}),
        user_data,
        custom_data: { currency: p.currency, value: p.value },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pid}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { ok: false, reason: `meta ${res.status}: ${t.slice(0, 250)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "capi_error" };
  }
}
