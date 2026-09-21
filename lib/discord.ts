// Notifikasi Discord via webhook. URL dari env (DISCORD_WEBHOOK_URL).

export function isDiscordConfigured(): boolean {
  return Boolean(process.env.DISCORD_WEBHOOK_URL);
}

export async function sendDiscordPurchase(params: {
  name: string;
  email: string;
  mobile: string;
  amount: string; // Rp197.000
  city?: string;
  method?: string; // "QRIS (Bank BCA)" / "BCA Virtual Account" / "OVO"
  feeLabel?: string; // "Rp1.379" atau "Rp4.440 (estimasi)"
  netLabel?: string; // amount - fee
  source: string; // "🟢 Iklan (ad-click)" / "🔵 Organik / langsung"
  capiFired: boolean;
  orderRef: string;
  todayCount: number;
  todayTotal: string; // Rp X
}): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "discord_not_configured" };

  const feeText = params.feeLabel
    ? `${params.feeLabel}${params.netLabel ? ` · Net ${params.netLabel}` : ""}`
    : "-";

  const fields = [
    { name: "👤 Nama", value: params.name || "-", inline: true },
    { name: "📧 Email", value: params.email || "-", inline: true },
    { name: "💵 Jumlah", value: params.amount || "-", inline: true },
    { name: "🏙️ Kota", value: params.city || "-", inline: true },
    { name: "💳 Metode", value: params.method || "-", inline: true },
    { name: "🏦 Biaya DurianPay", value: feeText, inline: true },
    {
      name: "📈 Sumber",
      value: `${params.source} → di-fire ke Meta ${params.capiFired ? "✅" : "—"}`,
      inline: false,
    },
    { name: "✅ Status", value: `PAID · ${params.mobile || "-"}`, inline: false },
    {
      name: "📊 Penjualan hari ini",
      value: `**#${params.todayCount}** · ${params.todayTotal}`,
      inline: false,
    },
  ];

  const body = {
    username: "KitabCuan",
    embeds: [
      {
        title: "💰 Pembelian Baru — KitabCuan",
        color: 0x47632b, // hijau brand
        fields,
        footer: { text: `KitabCuan • DurianPay • ${params.orderRef}` },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  return postDiscord(url, body);
}

export async function sendDiscordDelivered(params: {
  name: string;
  email: string;
  orderRef: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "discord_not_configured" };

  const body = {
    username: "KitabCuan",
    embeds: [
      {
        title: "📦 Produk Terkirim — KitabCuan",
        description: "Email akses berhasil dikirim ke pembeli ✅",
        color: 0x2f7d32, // hijau
        fields: [
          { name: "👤 Nama", value: params.name || "-", inline: true },
          { name: "📧 Email", value: params.email || "-", inline: true },
          {
            name: "📨 Yang dikirim",
            value: "Link folder Google Drive + akses Tools AI",
            inline: false,
          },
        ],
        footer: { text: `KitabCuan • ${params.orderRef}` },
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
