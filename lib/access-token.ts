import crypto from "crypto";

// Token akses tools (DB-free): base64url(payloadJSON).base64url(HMAC-SHA256).
// Dipakai untuk "magic link" pembuka Tools AI yang dikirim ke email buyer.

export type AccessPayload = {
  ref: string; // order ref / id
  email: string;
  iat: number; // issued-at (detik)
  exp?: number; // expiry opsional (detik epoch)
};

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

function secret(): string {
  const s = process.env.ACCESS_TOKEN_SECRET;
  if (!s) throw new Error("ACCESS_TOKEN_SECRET belum diset.");
  return s;
}

export function isAccessConfigured(): boolean {
  return Boolean(process.env.ACCESS_TOKEN_SECRET);
}

export function signAccess(
  payload: Omit<AccessPayload, "iat"> & { iat?: number },
): string {
  const full: AccessPayload = { iat: Math.floor(Date.now() / 1000), ...payload };
  const body = b64url(JSON.stringify(full));
  const sig = b64url(crypto.createHmac("sha256", secret()).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyAccess(token: string | undefined | null): AccessPayload | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = crypto.createHmac("sha256", secret()).update(body).digest();
  const given = b64urlDecode(sig);
  if (expected.length !== given.length) return null;
  if (!crypto.timingSafeEqual(expected, given)) return null;

  let payload: AccessPayload;
  try {
    payload = JSON.parse(b64urlDecode(body).toString("utf8"));
  } catch {
    return null;
  }
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;
  return payload;
}
