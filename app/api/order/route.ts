import { NextResponse } from "next/server";
import { createPaymentLinkOrder, isDurianpayConfigured } from "@/lib/durianpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_PRICE = Number(process.env.PRODUCT_PRICE || "197000");

type OrderPayload = {
  name?: string;
  phone?: string;
  email?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^8[0-9]{8,11}$/;

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

  if (name.length < 2 || !emailRegex.test(email) || !phoneRegex.test(phone)) {
    return NextResponse.json({ ok: false, message: "Data pesanan tidak lengkap." }, { status: 400 });
  }

  if (!isDurianpayConfigured()) {
    console.error("[order] DURIANPAY_SECRET_KEY belum diset.");
    return NextResponse.json(
      { ok: false, reason: "payment_not_configured", message: "Pembayaran belum aktif. Coba lagi nanti." },
      { status: 503 },
    );
  }

  const orderRefId = `kc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const { paymentUrl } = await createPaymentLinkOrder({
      amount: PRODUCT_PRICE,
      orderRefId,
      customer: { name, email, mobile: `+62${phone}` },
    });
    return NextResponse.json({ ok: true, paymentUrl });
  } catch (err) {
    console.error("[order] gagal buat payment link:", err);
    return NextResponse.json(
      { ok: false, message: "Gagal membuat pembayaran. Coba lagi sebentar ya." },
      { status: 502 },
    );
  }
}
