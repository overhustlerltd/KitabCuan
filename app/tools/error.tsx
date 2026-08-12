"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 px-4 text-center dark:bg-neutral-950">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-semibold text-foreground">Waduh, ada yang salah</h2>
        <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
          Halaman tools gagal dimuat. Coba muat ulang, ya.
        </p>
      </div>
      <Button type="button" variant="primary" size="md" onClick={reset}>
        Coba Lagi
      </Button>
    </div>
  );
}
