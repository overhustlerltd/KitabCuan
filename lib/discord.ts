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
  totalIdr: string; // "Rp 394.000"
  usdLabel?: string; // "(~$21)"
  orderCount: number;
  customerCount: number;
  productLines: string[]; // "• KitabCuan — Paket Usaha (197k) — 2 × Rp 394.000"
  channelLines: string[]; // "• QRIS — 2 (Rp 394.000)"
  feeLabel: string; // "~Rp 2.758 (0.70%)"
  profitLabel: string; // "~Rp 391.242"
}): Promise<{ ok: boolean; reason?: string }> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return { ok: false, reason: "discord_not_configured" };

  const dash = "—";
  const body = {
    username: "KitabCuan",
    embeds: [
      {
        title: `📊 Kitab Cuan — Ringkasan Harian (${params.dateLabel} WIB)`,
        color: 0xc9821f, // emas brand
        fields: [
          {
            name: "💰 Total Pendapatan",
            value: `**${params.totalIdr}**${params.usdLabel ? ` ${params.usdLabel}` : ""}\n${params.orderCount} order · ${params.customerCount} pelanggan`,
            inline: false,
          },
          {
            name: "📦 Rincian Produk",
            value: params.productLines.length ? params.productLines.join("\n") : dash,
            inline: true,
          },
          {
            name: "💳 Channel Bayar",
            value: params.channelLines.length ? params.channelLines.join("\n") : dash,
            inline: true,
          },
          { name: "🏦 Biaya DurianPay (est)", value: params.feeLabel, inline: true },
          { name: "🟢 Laba (sebelum iklan)", value: params.profitLabel, inline: true },
        ],
        footer: {
          text: "Belum termasuk biaya iklan · estimasi biaya DurianPay · sumber: DurianPay orders",
        },
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
