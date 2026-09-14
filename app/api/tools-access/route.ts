import { NextRequest, NextResponse } from "next/server";
import { verifyAccess } from "@/lib/access-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE = "kc_akses";
const MAX_AGE = 60 * 60 * 24 * 365; // 1 tahun

function setCookieAndRedirect(req: NextRequest, token: string) {
  const res = NextResponse.redirect(new URL("/tools", req.url));
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return res;
}

// Magic link dari email: /api/tools-access?akses=<token>
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("akses");
  if (!token || !verifyAccess(token)) {
    return NextResponse.redirect(new URL("/tools?locked=1&err=1", req.url));
  }
  return setCookieAndRedirect(req, token);
}

// Input kode manual dari halaman gate (form POST).
export async function POST(req: NextRequest) {
  let token = "";
  const ctype = req.headers.get("content-type") || "";
  try {
    if (ctype.includes("application/json")) {
      const body = (await req.json()) as { code?: string };
      token = (body.code || "").trim();
    } else {
      const form = await req.formData();
      token = (form.get("code")?.toString() || "").trim();
    }
  } catch {
    token = "";
  }

  if (!token || !verifyAccess(token)) {
    return NextResponse.redirect(new URL("/tools?locked=1&err=1", req.url), { status: 303 });
  }
  return setCookieAndRedirect(req, token);
}
