import { NextResponse, type NextRequest } from "next/server";

// Middleware jalan di Edge runtime -> pakai Web Crypto (bukan node:crypto).
// Tugas: kunci 6 API tools AI (yang menghabiskan token Anthropic) untuk pembeli saja.
// Halaman /tools sendiri melakukan self-gate di server component (Node).

const COOKIE = "kc_akses";

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) return false;

  const [body, sig] = token.split(".");
  if (!body || !sig) return false;

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret) as unknown as BufferSource,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBytes(sig) as unknown as BufferSource,
      new TextEncoder().encode(body) as unknown as BufferSource,
    );
    if (!ok) return false;

    // Cek expiry kalau ada.
    const json = JSON.parse(new TextDecoder().decode(b64urlToBytes(body))) as {
      exp?: number;
    };
    if (json.exp && Math.floor(Date.now() / 1000) > json.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE)?.value;
  const ok = await verifyToken(token);
  if (ok) return NextResponse.next();

  return NextResponse.json(
    { error: "Akses tools ini khusus pembeli. Buka lewat link di email kamu." },
    { status: 401 },
  );
}

export const config = {
  matcher: [
    "/api/chat",
    "/api/kalkulator-hpp",
    "/api/nama-usaha",
    "/api/rencana-jualan",
    "/api/rencana-menu",
    "/api/tulisan-promosi",
  ],
};
