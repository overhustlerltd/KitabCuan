import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Mail, ArrowLeft } from "lucide-react";
import { PixelEvent } from "@/components/analytics/meta-pixel";

export const metadata: Metadata = {
  title: "Terima Kasih — KitabCuan",
  description: "Pembayaran sedang diproses. Cek email untuk akses KitabCuan.",
  robots: { index: false, follow: false },
};

export default function TerimaKasihPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16 text-foreground">
      <PixelEvent event="Purchase" params={{ currency: "IDR", value: 197000, content_name: "KitabCuan" }} />
      <div className="w-full max-w-lg rounded-3xl border-2 border-border bg-card p-8 text-center shadow-md sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-foreground sm:text-3xl">
          Terima kasih! 🎉
        </h1>
        <p className="mt-3 text-neutral-600">
          Pembayaranmu sedang kami proses. Begitu berhasil terkonfirmasi, akses kitab + tools AI
          akan otomatis dikirim ke emailmu.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 px-5 py-4 text-sm text-neutral-600">
          <Mail className="h-4 w-4 shrink-0 text-primary" />
          Cek inbox (dan folder Spam/Promosi) email kamu ya.
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
