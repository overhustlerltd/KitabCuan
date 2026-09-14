// Helper email transaksional via Brevo. Semua kredensial dari env.

const PRODUCT_NAME = "KitabCuan — Paket Usaha Sumber Cuan";

export function isBrevoConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

type Recipient = { email: string; name?: string };

export async function sendBrevoEmail(params: {
  to: Recipient[];
  subject: string;
  htmlContent: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "KitabCuan";
  if (!apiKey || !senderEmail) throw new Error("Brevo belum dikonfigurasi.");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${detail.slice(0, 300)}`);
  }
}

// ---- Template ----

export function deliveryEmailHtml(params: {
  name: string;
  driveUrl: string;
  toolsUrl: string;
  price: string;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#18221b">
    <h2 style="color:#47632B">Terima kasih, ${escapeHtml(params.name)}! 🎉</h2>
    <p>Pembayaranmu untuk <strong>${PRODUCT_NAME}</strong> sudah kami terima. Akses kamu langsung aktif:</p>
    <div style="margin:24px 0;padding:20px;border:1px solid #e5e7dd;border-radius:14px;background:#f7f8f3">
      <p style="margin:0 0 8px;font-weight:bold">📕 File produk (Google Drive)</p>
      <a href="${params.driveUrl}" style="display:inline-block;margin-bottom:18px;padding:12px 20px;background:#47632B;color:#fff;text-decoration:none;border-radius:10px;font-weight:bold">Buka Folder Produk</a>
      <p style="margin:0 0 8px;font-weight:bold">🤖 Tools AI (khusus pembeli)</p>
      <a href="${params.toolsUrl}" style="display:inline-block;padding:12px 20px;background:#c9821f;color:#fff;text-decoration:none;border-radius:10px;font-weight:bold">Buka Tools AI</a>
    </div>
    <p style="color:#6a7358;font-size:13px">Simpan email ini. Link Tools AI di atas adalah kunci akses pribadimu — jangan dibagikan ke orang lain ya.</p>
    <p style="color:#6a7358;font-size:13px">Ada kendala akses? Balas email ini.</p>
  </div>`;
}

export function adminNotifyHtml(params: {
  name: string;
  email: string;
  mobile: string;
  price: string;
  orderRef: string;
}): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#18221b">
    <h2 style="color:#2f7d32">✅ Pembayaran LUNAS — kirim akses otomatis</h2>
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:6px 0;color:#6a7358">Nama</td><td style="text-align:right"><strong>${escapeHtml(params.name)}</strong></td></tr>
      <tr><td style="padding:6px 0;color:#6a7358">Email</td><td style="text-align:right">${escapeHtml(params.email)}</td></tr>
      <tr><td style="padding:6px 0;color:#6a7358">WhatsApp</td><td style="text-align:right">${escapeHtml(params.mobile)}</td></tr>
      <tr><td style="padding:6px 0;color:#6a7358">Order Ref</td><td style="text-align:right">${escapeHtml(params.orderRef)}</td></tr>
      <tr><td style="padding:6px 0;color:#6a7358">Total</td><td style="text-align:right"><strong>${escapeHtml(params.price)}</strong></td></tr>
    </table>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
