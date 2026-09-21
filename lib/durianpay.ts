// Helper tipis untuk DurianPay Server API (v1).
// Auth: HTTP Basic -> base64("<SECRET_KEY>:")  (perhatikan titik dua di akhir).
// Key diambil dari env, TIDAK di-hardcode.

const BASE_URL = process.env.DURIANPAY_BASE_URL || "https://api.durianpay.id/v1";

function authHeader(): string {
  const key = process.env.DURIANPAY_SECRET_KEY;
  if (!key) throw new Error("DURIANPAY_SECRET_KEY belum diset.");
  const token = Buffer.from(`${key}:`).toString("base64");
  return `Basic ${token}`;
}

export function isDurianpayConfigured(): boolean {
  return Boolean(process.env.DURIANPAY_SECRET_KEY);
}

export type CreateOrderInput = {
  amount: number; // dalam Rupiah penuh, mis. 197000
  orderRefId: string;
  customer: { name: string; email: string; mobile: string };
  expiryMinutes?: number;
  // Data attribution Meta (disimpan di metadata order, dipakai CAPI di webhook).
  tracking?: { fbp?: string; fbc?: string; clientIp?: string; userAgent?: string };
};

export type CreateOrderResult = {
  orderId: string;
  paymentUrl: string;
};

/**
 * Buat order berupa payment link (halaman bayar hosted DurianPay: VA/QRIS/e-wallet).
 * Balikan: id order + URL halaman bayar untuk redirect buyer.
 */
export async function createPaymentLinkOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const expiry = new Date(
    Date.now() + (input.expiryMinutes ?? 60 * 24) * 60 * 1000,
  ).toISOString();

  const body = {
    amount: String(input.amount),
    currency: "IDR",
    is_payment_link: true,
    order_ref_id: input.orderRefId,
    customer: {
      customer_ref_id: input.customer.email,
      given_name: input.customer.name,
      email: input.customer.email,
      mobile: input.customer.mobile,
    },
    // Simpan data buyer di metadata sebagai cadangan (getOrder DurianPay tidak
    // meng-embed objek customer, hanya customer_id).
    metadata: {
      buyer_email: input.customer.email,
      buyer_name: input.customer.name,
      buyer_mobile: input.customer.mobile,
      ...(input.tracking?.fbp ? { buyer_fbp: input.tracking.fbp } : {}),
      ...(input.tracking?.fbc ? { buyer_fbc: input.tracking.fbc } : {}),
      ...(input.tracking?.clientIp ? { buyer_ip: input.tracking.clientIp } : {}),
      ...(input.tracking?.userAgent ? { buyer_ua: input.tracking.userAgent } : {}),
    },
    expiry_date: expiry,
    payment_option: "full_payment",
    admin_fee_method: "included",
  };

  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DurianPay create order ${res.status}: ${detail.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    data?: { id?: string; payment_link_url?: string };
  };
  const data = json.data ?? {};
  const id = data.id;
  const linkCode = data.payment_link_url;
  if (!id || !linkCode) {
    throw new Error(`DurianPay respons tak terduga: ${JSON.stringify(json).slice(0, 400)}`);
  }

  // linkCode bisa berupa kode pendek atau URL penuh; tangani keduanya.
  const paymentUrl = linkCode.startsWith("http")
    ? linkCode
    : `https://links.durianpay.id/payment/${linkCode}`;

  return { orderId: id, paymentUrl };
}

export type OrderStatus = {
  id: string;
  status: string;
  orderRefId?: string;
  amount?: string;
  customerEmail?: string;
  customerName?: string;
  customerMobile?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  isPaid: boolean;
};

const PAID_STATES = new Set([
  "completed",
  "paid",
  "settled",
  "success",
  "captured",
]);

async function fetchCustomer(customerId: string): Promise<{
  email?: string;
  given_name?: string;
  mobile?: string;
} | null> {
  try {
    const res = await fetch(`${BASE_URL}/customers/${encodeURIComponent(customerId)}`, {
      method: "GET",
      headers: { Authorization: authHeader(), Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      data?: { email?: string; given_name?: string; mobile?: string };
    };
    return json.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Ambil status order dari DurianPay (otoritatif). Dipakai webhook untuk
 * memastikan order benar-benar lunas sebelum kirim produk.
 * Catatan: order detail DurianPay TIDAK meng-embed objek customer, hanya
 * customer_id + metadata. Jadi email diambil dari metadata, lalu fallback
 * ke endpoint /customers/{id}.
 */
export async function getOrder(orderId: string): Promise<OrderStatus> {
  const res = await fetch(`${BASE_URL}/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: {
      Authorization: authHeader(),
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DurianPay get order ${res.status}: ${detail.slice(0, 400)}`);
  }

  const json = (await res.json()) as {
    data?: {
      id?: string;
      status?: string;
      order_ref_id?: string;
      amount?: string;
      customer_id?: string;
      customer?: { email?: string; given_name?: string; mobile?: string };
      metadata?: {
        buyer_email?: string;
        buyer_name?: string;
        buyer_mobile?: string;
        buyer_fbp?: string;
        buyer_fbc?: string;
        buyer_ip?: string;
        buyer_ua?: string;
      };
    };
  };
  const d = json.data ?? {};
  const status = (d.status ?? "").toLowerCase();
  const meta = d.metadata ?? {};

  let email = d.customer?.email || meta.buyer_email;
  let name = d.customer?.given_name || meta.buyer_name;
  let mobile = d.customer?.mobile || meta.buyer_mobile;

  // Fallback terakhir: ambil dari endpoint customer.
  if (!email && d.customer_id) {
    const cust = await fetchCustomer(d.customer_id);
    if (cust) {
      email = email || cust.email;
      name = name || cust.given_name;
      mobile = mobile || cust.mobile;
    }
  }

  return {
    id: d.id ?? orderId,
    status,
    orderRefId: d.order_ref_id,
    amount: d.amount,
    customerEmail: email,
    customerName: name,
    customerMobile: mobile,
    fbp: meta.buyer_fbp,
    fbc: meta.buyer_fbc,
    clientIp: meta.buyer_ip,
    userAgent: meta.buyer_ua,
    isPaid: PAID_STATES.has(status),
  };
}

export type OrderSummary = {
  id: string;
  status: string;
  amount: number;
  createdAt?: string;
  orderRefId?: string;
  name?: string;
  email?: string;
  isPaid: boolean;
};

/** Ambil daftar order terbaru (untuk recap harian). */
export async function listOrders(limit = 100): Promise<OrderSummary[]> {
  const res = await fetch(`${BASE_URL}/orders?limit=${limit}`, {
    method: "GET",
    headers: { Authorization: authHeader(), Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`DurianPay list orders ${res.status}: ${detail.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: unknown };
  const d = json.data as { orders?: unknown[] } | unknown[] | undefined;
  const raw = Array.isArray(d) ? d : (d?.orders ?? []);
  return (raw as Record<string, unknown>[]).map((o) => {
    const status = String(o.status ?? "").toLowerCase();
    return {
      id: String(o.id ?? ""),
      status,
      amount: Number(o.amount) || 0,
      createdAt: o.created_at as string | undefined,
      orderRefId: o.order_ref_id as string | undefined,
      name: o.given_name as string | undefined,
      email: o.email as string | undefined,
      isPaid: PAID_STATES.has(status),
    };
  });
}
