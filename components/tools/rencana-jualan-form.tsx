"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultCard } from "@/components/tools/result-card";
import { ToolErrorState, ToolLoadingState } from "@/components/tools/tool-status";

const formSchema = z.object({
  jualanApa: z.string().trim().min(2, "Ceritakan dulu kamu mau cuan dari apa"),
  caraJualan: z.enum(["wa-ig", "sekitar-rumah", "marketplace", "semua"], {
    message: "Pilih salah satu cara jualan",
  }),
  statusJualan: z.enum(["belum-ada", "sudah-ada"], {
    message: "Pilih status jualan kamu",
  }),
  budgetPromosi: z.enum(["belum-ada", "50-100rb", "100-300rb", "300rb-plus"], {
    message: "Pilih budget promosi kamu",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type RencanaHari = { day: number; title: string; actions: string[] };
type RencanaJualanResult = { days: RencanaHari[] };

export function RencanaJualanForm() {
  const [result, setResult] = useState<RencanaJualanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const generate = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setLastValues(values);
    try {
      const res = await fetch("/api/rencana-jualan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyusun rencana cuan.");
    } finally {
      setIsLoading(false);
    }
  };

  const fullPlanText = result
    ? result.days
        .map((d) => `Hari ${d.day}: ${d.title}\n${d.actions.map((a) => `- ${a}`).join("\n")}`)
        .join("\n\n")
    : "";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(generate)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jualanApa" className="text-sm font-medium text-foreground">
            Kamu mau cuan dari apa?
          </label>
          <Input
            id="jualanApa"
            placeholder="Contoh: jualan baju thrift, jasa desain, dropship skincare"
            invalid={!!errors.jualanApa}
            {...register("jualanApa")}
          />
          {errors.jualanApa && <p className="text-xs text-red-500">{errors.jualanApa.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="caraJualan" className="text-sm font-medium text-foreground">
            Cara jualan
          </label>
          <Select id="caraJualan" defaultValue="" invalid={!!errors.caraJualan} {...register("caraJualan")}>
            <option value="" disabled>
              Pilih cara jualan
            </option>
            <option value="wa-ig">WhatsApp & Instagram</option>
            <option value="sekitar-rumah">Dari mulut ke mulut di sekitar rumah</option>
            <option value="marketplace">Marketplace (Shopee/Tokopedia)</option>
            <option value="semua">Semua cara sekaligus</option>
          </Select>
          {errors.caraJualan && <p className="text-xs text-red-500">{errors.caraJualan.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="statusJualan" className="text-sm font-medium text-foreground">
            Status penjualan saat ini
          </label>
          <Select
            id="statusJualan"
            defaultValue=""
            invalid={!!errors.statusJualan}
            {...register("statusJualan")}
          >
            <option value="" disabled>
              Pilih status jualan
            </option>
            <option value="belum-ada">Belum ada</option>
            <option value="sudah-ada">Sudah ada beberapa</option>
          </Select>
          {errors.statusJualan && <p className="text-xs text-red-500">{errors.statusJualan.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="budgetPromosi" className="text-sm font-medium text-foreground">
            Budget promosi
          </label>
          <Select
            id="budgetPromosi"
            defaultValue=""
            invalid={!!errors.budgetPromosi}
            {...register("budgetPromosi")}
          >
            <option value="" disabled>
              Pilih budget promosi
            </option>
            <option value="belum-ada">Belum ada</option>
            <option value="50-100rb">Rp50rb - Rp100rb</option>
            <option value="100-300rb">Rp100rb - Rp300rb</option>
            <option value="300rb-plus">&gt;Rp300rb</option>
          </Select>
          {errors.budgetPromosi && <p className="text-xs text-red-500">{errors.budgetPromosi.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
          {isLoading ? (
            "Sedang menyusun rencana..."
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Buatkan Rencana Cuan Saya
            </>
          )}
        </Button>
      </form>

      {isLoading && <ToolLoadingState message="Sedang menyusun rencana..." />}

      {!isLoading && error && (
        <ToolErrorState message={error} onRetry={() => lastValues && generate(lastValues)} />
      )}

      {!isLoading && !error && result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">Rencana Cuan 7 Hari Kamu</h3>
            <CopyButton text={fullPlanText} label="Salin Semua" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.days.map((day) => (
              <ResultCard
                key={day.day}
                title={day.title}
                badge={day.day}
                copyText={`Hari ${day.day}: ${day.title}\n${day.actions.map((a) => `- ${a}`).join("\n")}`}
              >
                <ul className="flex flex-col gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
                  {day.actions.map((action, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </ResultCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
