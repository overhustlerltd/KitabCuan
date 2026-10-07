import { NextResponse } from "next/server";
import { chargeVaOnOrder, isDurianpayConfigured } from "@/lib/durianpay";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_PRICE = Number(process.env.PRODUCT_PRICE || "197000");
const ALLOWED_BANKS = new Set(["BCA", "MANDIRI", "BNI", "BRI", "PERMATA", "CIMB"]);

// Generate nomor Virtual Account untuk sebuah order + bank tertentu (on-demand).
export async function POST(request: Request) {
  let body: { order?: string; bank?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Body tidak valid." }, { status: 400 });
  }

  const order = (body.order ?? "").toString().trim();
  const bank = (body.bank ?? "").toString().trim().toUpperCase();

  if (!order || !ALLOWED_BANKS.has(bank)) {
    return NextResponse.json({ ok: false, message: "Metode tidak valid." }, { status: 400 });
  }
  if (!isDurianpayConfigured()) {
    return NextResponse.json({ ok: false, message: "Pembayaran belum aktif." }, { status: 503 });
  }

  try {
    const va = await chargeVaOnOrder(order, bank, "KitabCuan", PRODUCT_PRICE);
    return NextResponse.json({
      ok: true,
      bank,
      accountNumber: va.accountNumber,
      expiresAt: va.expiresAt,
    });
  } catch (err) {
    console.error("[order/va] gagal buat VA:", err);
    return NextResponse.json(
      { ok: false, message: "Gagal membuat nomor VA. Coba bank lain atau QRIS." },
      { status: 502 },
    );
  }
}
