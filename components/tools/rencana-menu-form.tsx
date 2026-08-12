"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChefHat } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/copy-button";
import { ResultCard } from "@/components/tools/result-card";
import { ToolErrorState, ToolLoadingState } from "@/components/tools/tool-status";

const formSchema = z.object({
  jenisMenuUtama: z.string().trim().min(2, "Ceritakan dulu kamu mau jualan makanan apa"),
  segmentPasar: z.enum(["keluarga-rumahan", "anak-muda", "kantoran", "semua"], {
    message: "Pilih segmen pasar kamu",
  }),
  modalHarian: z.enum(["di-bawah-100rb", "100-300rb", "300-500rb", "500rb-plus"], {
    message: "Pilih kisaran modal harian kamu",
  }),
  canalJualan: z.enum(["wa-ig", "pesan-antar", "titip-warung", "semua"], {
    message: "Pilih cara jualannya",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type MenuHari = { day: number; title: string; menu: string[]; tips: string };
type RencanaMenuResult = { days: MenuHari[] };

export function RencanaMenuForm() {
  const [result, setResult] = useState<RencanaMenuResult | null>(null);
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
      const res = await fetch("/api/rencana-menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyusun rencana menu.");
    } finally {
      setIsLoading(false);
    }
  };

  const fullPlanText = result
    ? result.days
        .map(
          (d) =>
            `Hari ${d.day}: ${d.title}\nMenu: ${d.menu.join(", ")}\nTips: ${d.tips}`,
        )
        .join("\n\n")
    : "";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(generate)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jenisMenuUtama" className="text-sm font-medium text-foreground">
            Kamu mau jualan masakan apa?
          </label>
          <Input
            id="jenisMenuUtama"
            placeholder="Contoh: nasi box, kue kering, ayam geprek, minuman kekinian"
            invalid={!!errors.jenisMenuUtama}
            {...register("jenisMenuUtama")}
          />
          {errors.jenisMenuUtama && <p className="text-xs text-red-500">{errors.jenisMenuUtama.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="segmentPasar" className="text-sm font-medium text-foreground">
            Target pembeli
          </label>
          <Select id="segmentPasar" defaultValue="" invalid={!!errors.segmentPasar} {...register("segmentPasar")}>
            <option value="" disabled>
              Pilih target pembeli
            </option>
            <option value="keluarga-rumahan">Keluarga & ibu rumah tangga</option>
            <option value="anak-muda">Anak muda & remaja</option>
            <option value="kantoran">Pekerja kantoran</option>
            <option value="semua">Semua kalangan</option>
          </Select>
          {errors.segmentPasar && <p className="text-xs text-red-500">{errors.segmentPasar.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="modalHarian" className="text-sm font-medium text-foreground">
            Kisaran modal belanja per hari
          </label>
          <Select
            id="modalHarian"
            defaultValue=""
            invalid={!!errors.modalHarian}
            {...register("modalHarian")}
          >
            <option value="" disabled>
              Pilih kisaran modal
            </option>
            <option value="di-bawah-100rb">Di bawah Rp100.000</option>
            <option value="100-300rb">Rp100.000 - Rp300.000</option>
            <option value="300-500rb">Rp300.000 - Rp500.000</option>
            <option value="500rb-plus">Di atas Rp500.000</option>
          </Select>
          {errors.modalHarian && <p className="text-xs text-red-500">{errors.modalHarian.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="canalJualan" className="text-sm font-medium text-foreground">
            Cara jualan
          </label>
          <Select
            id="canalJualan"
            defaultValue=""
            invalid={!!errors.canalJualan}
            {...register("canalJualan")}
          >
            <option value="" disabled>
              Pilih cara jualan
            </option>
            <option value="wa-ig">WhatsApp & Instagram</option>
            <option value="pesan-antar">Pesan antar / GoFood / ShopeeFood</option>
            <option value="titip-warung">Titip di warung / kantin sekitar</option>
            <option value="semua">Semua cara sekaligus</option>
          </Select>
          {errors.canalJualan && <p className="text-xs text-red-500">{errors.canalJualan.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
          {isLoading ? (
            "Sedang menyusun rencana menu..."
          ) : (
            <>
              <ChefHat className="h-4 w-4" />
              Buatkan Rencana Menu Saya
            </>
          )}
        </Button>
      </form>

      {isLoading && <ToolLoadingState message="Sedang meracik rencana menu terbaik untukmu..." />}

      {!isLoading && error && (
        <ToolErrorState message={error} onRetry={() => lastValues && generate(lastValues)} />
      )}

      {!isLoading && !error && result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">Rencana Menu 7 Hari Kamu</h3>
            <CopyButton text={fullPlanText} label="Salin Semua" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {result.days.map((day) => (
              <ResultCard
                key={day.day}
                title={day.title}
                badge={day.day}
                copyText={`Hari ${day.day}: ${day.title}\nMenu: ${day.menu.join(", ")}\nTips: ${day.tips}`}
              >
                <div className="flex flex-col gap-2 text-sm text-neutral-600">
                  <div>
                    <p className="mb-1 font-medium text-foreground">Menu:</p>
                    <ul className="flex flex-col gap-1">
                      {day.menu.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-primary">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-1 rounded-lg bg-accent-400/10 px-3 py-2 text-xs font-medium text-accent-700">
                    💡 {day.tips}
                  </p>
                </div>
              </ResultCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
