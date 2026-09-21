// Notifikasi Discord via webhook. URL dari env (DISCORD_WEBHOOK_URL).

export function isDiscordConfigured(): boolean {
  return Boolean(process.env.DISCORD_WEBHOOK_URL);
}

export async function sendDiscordPurchase(params: {
  name: string;
  email: string;
  mobile: string;
  price: string;
  orderRef: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "discord_not_configured" };

  const body = {
    username: "KitabCuan",
    embeds: [
      {
        title: "💰 Pembelian Baru!",
        description: "Ada pembeli baru **KitabCuan** 🎉",
        color: 0x47632b, // hijau brand
        fields: [
          { name: "👤 Nama", value: params.name || "-", inline: true },
          { name: "💵 Total", value: params.price || "-", inline: true },
          { name: "📧 Email", value: params.email || "-", inline: false },
          { name: "📱 WhatsApp", value: params.mobile || "-", inline: true },
          { name: "🧾 Order Ref", value: params.orderRef || "-", inline: true },
        ],
        footer: { text: "KitabCuan • DurianPay" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return postDiscord(url, body);
}

export async function sendDiscordRecap(params: {
  dateLabel: string;
  count: number;
  total: string;
  lines: string[];
}): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "discord_not_configured" };

  const description =
    params.count === 0
      ? "Belum ada pembelian hari ini. 🌙 Semangat besok!"
      : params.lines.slice(0, 15).join("\n") +
        (params.lines.length > 15 ? `\n…dan ${params.lines.length - 15} lainnya` : "");

  const body = {
    username: "KitabCuan",
    embeds: [
      {
        title: `📊 Recap Harian — ${params.dateLabel}`,
        color: 0xc9821f, // emas brand
        fields: [
          { name: "🧾 Total Transaksi", value: `${params.count} pembelian`, inline: true },
          { name: "💰 Total Omzet", value: params.total, inline: true },
        ],
        description,
        footer: { text: "KitabCuan • DurianPay" },
        timestamp: new Date().toISOString(),
      },
    ],
  };
  return postDiscord(url, body);
}

async function postDiscord(url: string, body: unknown): Promise<{ ok: boolean; reason?: string }> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      return { ok: false, reason: `discord ${res.status}: ${t.slice(0, 200)}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "discord_error" };
  }
}
