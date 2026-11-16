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
  /**
   * Kode dari Events Manager → Test events. Kalau diisi, event muncul di tab
   * "Test events" dan TIDAK dihitung sebagai konversi asli. Dipakai untuk
   * membuktikan token CAPI masih hidup tanpa mengotori data iklan.
   */
  testEventCode?: string;
};

export type CapiResult = {
  ok: boolean;
  reason?: string;
  /** Jumlah event yang diterima Meta (dari respons Graph API). */
  eventsReceived?: number;
  /** ID jejak Meta, berguna kalau perlu lapor ke dukungan Meta. */
  fbtraceId?: string;
  attempts?: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendMetaCapiPurchase(p: CapiPurchaseInput): Promise<CapiResult> {
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
    ...(p.testEventCode ? { test_event_code: p.testEventCode } : {}),
  };

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${pid}/events?access_token=${encodeURIComponent(token)}`;

  // Satu kali coba ulang untuk kegagalan SEMENTARA (jaringan, 429, 5xx).
  // Error 4xx lain (token mati, parameter salah) tidak diulang — hasilnya sama.
  // Aman diulang: event_id = order ref, jadi Meta men-dedup kalau ternyata
  // percobaan pertama sebenarnya sudah sampai.
  let lastReason = "capi_error";
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        cache: "no-store",
      });
      const text = await res.text().catch(() => "");
      if (res.ok) {
        let j: { events_received?: number; fbtrace_id?: string } = {};
        try {
          j = JSON.parse(text);
        } catch {
          /* respons bukan JSON — tetap anggap sukses karena status 2xx */
        }
        return {
          ok: true,
          eventsReceived: j.events_received,
          fbtraceId: j.fbtrace_id,
          attempts: attempt,
        };
      }
      // Jangan pernah mengembalikan URL (berisi token) — cukup status + isi error.
      lastReason = `meta ${res.status}: ${text.slice(0, 250)}`;
      const transient = res.status === 429 || res.status >= 500;
      if (!transient) return { ok: false, reason: scrub(lastReason, token), attempts: attempt };
    } catch (err) {
      lastReason = scrub(err instanceof Error ? err.message : "capi_error", token);
    }
    if (attempt === 1) await sleep(800);
  }
  return { ok: false, reason: scrub(lastReason, token), attempts: 2 };
}

/** Pastikan token tidak pernah ikut keluar lewat pesan error / log. */
function scrub(reason: string, token: string): string {
  return token ? reason.split(token).join("[token]") : reason;
}
