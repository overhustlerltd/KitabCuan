import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYMENT_LABELS: Record<string, string> = {
  bca: "Bank Central Asia",
  qris: "QRIS",
  bri: "BRI Virtual Account",
  mandiri: "Bank Mandiri Virtual Account",
  bni: "BNI Virtual Account",
  dana: "Dana",
  shopeepay: "ShopeePay",
  gopay: "GoPay",
};

const PRODUCT_NAME = "KitabCuan — Paket Usaha Sumber Cuan";
const PRODUCT_PRICE = "Rp197.000";

type OrderPayload = {
  name?: string;
  phone?: string;
  email?: string;
  paymentMethod?: string;
};

async function sendBrevoEmail(params: {
  apiKey: string;
  sender: { name: string; email: string };
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": params.apiKey,
    },
    body: JSON.stringify({
      sender: params.sender,
      to: params.to,
      subject: params.subject,
      htmlContent: params.htmlContent,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${detail.slice(0, 300)}`);
  }
  return res.json().catch(() => ({}));
}

export async function POST(request: Request) {
  let body: OrderPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Body tidak valid." }, { status: 400 });
  }

  const name = (body.name ?? "").toString().trim();
  const phone = (body.phone ?? "").toString().trim();
  const email = (body.email ?? "").toString().trim();
  const paymentMethod = (body.paymentMethod ?? "").toString().trim();

  if (!name || !phone || !email || !paymentMethod) {
    return NextResponse.json({ ok: false, message: "Data pesanan tidak lengkap." }, { status: 400 });
  }

  const paymentLabel = PAYMENT_LABELS[paymentMethod] ?? paymentMethod;
  const waNumber = `+62${phone}`;

  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "KitabCuan";
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL;

  // Selalu catat order di log server (fallback bila email belum dikonfigurasi).
  console.log("[order] baru:", { name, waNumber, email, paymentLabel });

  // Kalau Brevo belum dikonfigurasi, order tetap diterima (tidak menggagalkan user).
  if (!apiKey || !senderEmail) {
    return NextResponse.json({ ok: true, emailSent: false, reason: "email_not_configured" });
  }

  const sender = { name: senderName, email: senderEmail };

  const buyerHtml = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#18221b">
      <h2 style="color:#47632B">Terima kasih, ${name}! 🎉</h2>
      <p>Pesananmu untuk <strong>${PRODUCT_NAME}</strong> sudah kami terima.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0;color:#6a7358">Produk</td><td style="text-align:right"><strong>${PRODUCT_NAME}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">Total</td><td style="text-align:right"><strong>${PRODUCT_PRICE}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">Metode Pembayaran</td><td style="text-align:right">${paymentLabel}</td></tr>
      </table>
      <p>Tim kami akan menghubungi kamu lewat WhatsApp (<strong>${waNumber}</strong>) untuk konfirmasi pembayaran dan kirim akses kitabnya.</p>
      <p style="color:#6a7358;font-size:13px">Kalau ada pertanyaan, tinggal balas email ini ya.</p>
    </div>`;

  const adminHtml = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#18221b">
      <h2 style="color:#c0341f">🔔 Order Baru Masuk</h2>
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr><td style="padding:6px 0;color:#6a7358">Nama</td><td style="text-align:right"><strong>${name}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">WhatsApp</td><td style="text-align:right">${waNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">Email</td><td style="text-align:right">${email}</td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">Metode</td><td style="text-align:right">${paymentLabel}</td></tr>
        <tr><td style="padding:6px 0;color:#6a7358">Total</td><td style="text-align:right"><strong>${PRODUCT_PRICE}</strong></td></tr>
      </table>
    </div>`;

  let emailSent = false;
  try {
    // Email konfirmasi ke pembeli
    await sendBrevoEmail({
      apiKey,
      sender,
      to: [{ email, name }],
      subject: "Pesanan KitabCuan kamu sudah kami terima ✅",
      htmlContent: buyerHtml,
    });

    // Notifikasi ke admin (opsional)
    if (adminEmail) {
      await sendBrevoEmail({
        apiKey,
        sender,
        to: [{ email: adminEmail }],
        subject: `Order baru: ${name} (${PRODUCT_PRICE})`,
        htmlContent: adminHtml,
      });
    }
    emailSent = true;
  } catch (err) {
    // Jangan gagalkan order kalau email error — cukup log.
    console.error("[order] gagal kirim email:", err);
  }

  return NextResponse.json({ ok: true, emailSent });
}
