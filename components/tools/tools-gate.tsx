"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, Loader2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TOOLS_LOCKED_CONTENT, TOOLS_PAGE_CONTENT } from "@/lib/constants";

export function ToolsGate({ initialError = false }: { initialError?: boolean }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(initialError);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/tools-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
        redirect: "follow",
      });
      // Sukses -> route mengarahkan ke /tools (tanpa ?locked). Kalau masih di gate, berarti gagal.
      if (res.redirected && !res.url.includes("locked")) {
        window.location.href = res.url;
        return;
      }
      setError(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-lg flex-col px-4 py-10 md:px-8 md:py-16">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {TOOLS_PAGE_CONTENT.backLabel}
        </Link>

        <div className="mt-10 rounded-3xl border-2 border-border bg-card p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-8 w-8" />
          </div>
          <Badge variant="accent" className="mx-auto mt-5 w-fit font-semibold">
            {TOOLS_LOCKED_CONTENT.badge}
          </Badge>
          <h1 className="mt-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">
            {TOOLS_LOCKED_CONTENT.title}
          </h1>
          <p className="mt-3 text-neutral-600">{TOOLS_LOCKED_CONTENT.subtitle}</p>

          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 text-left">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={TOOLS_LOCKED_CONTENT.inputPlaceholder}
              invalid={error}
              className="h-12 text-base"
            />
            {error && (
              <p className="text-sm font-semibold text-red-600">{TOOLS_LOCKED_CONTENT.errorMessage}</p>
            )}
            <Button type="submit" variant="accent" size="lg" disabled={busy} className="py-4 text-base font-black">
              {busy && <Loader2 className="h-5 w-5 animate-spin" />}
              {TOOLS_LOCKED_CONTENT.submitLabel}
            </Button>
          </form>

          <Link
            href={TOOLS_LOCKED_CONTENT.ctaBuyHref}
            className="mt-5 inline-block text-sm font-bold text-primary hover:underline"
          >
            {TOOLS_LOCKED_CONTENT.ctaBuyLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
