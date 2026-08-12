"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/tools/result-card";
import { ToolErrorState, ToolLoadingState } from "@/components/tools/tool-status";

const formSchema = z.object({
  jenisJualan: z.string().trim().min(2, "Ceritakan dulu jenis usaha kamu"),
  kesanNama: z.enum(["kekinian-gaul", "hangat-rumahan", "mewah-berkelas", "lucu-unik"], {
    message: "Pilih kesan nama yang diinginkan",
  }),
  kataYangDiinginkan: z.string().trim().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type NamaUsahaResult = {
  names: { name: string; tagline: string; reason: string }[];
};

export function NamaUsahaForm() {
  const [result, setResult] = useState<NamaUsahaResult | null>(null);
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
      const res = await fetch("/api/nama-usaha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari ide nama usaha.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(generate)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="jenisJualan" className="text-sm font-medium text-foreground">
            Jenis usaha/produk
          </label>
          <Input
            id="jenisJualan"
            placeholder="Contoh: kue kering rumahan, nasi box, minuman kekinian, katering harian"
            invalid={!!errors.jenisJualan}
            {...register("jenisJualan")}
          />
          {errors.jenisJualan && <p className="text-xs text-red-500">{errors.jenisJualan.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="kesanNama" className="text-sm font-medium text-foreground">
            Kesan nama yang diinginkan
          </label>
          <Select id="kesanNama" defaultValue="" invalid={!!errors.kesanNama} {...register("kesanNama")}>
            <option value="" disabled>
              Pilih kesan nama
            </option>
            <option value="kekinian-gaul">Kekinian & gaul</option>
            <option value="hangat-rumahan">Hangat & rumahan</option>
            <option value="mewah-berkelas">Mewah & berkelas</option>
            <option value="lucu-unik">Lucu & unik</option>
          </Select>
          {errors.kesanNama && <p className="text-xs text-red-500">{errors.kesanNama.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="kataYangDiinginkan" className="text-sm font-medium text-foreground">
            Kata yang ingin dipakai <span className="font-normal text-neutral-400">(opsional)</span>
          </label>
          <Input
            id="kataYangDiinginkan"
            placeholder="Contoh: cuan, berkah, mandiri"
            {...register("kataYangDiinginkan")}
          />
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
          {isLoading ? (
            "Sedang mencari ide nama..."
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Carikan Nama Usaha Saya
            </>
          )}
        </Button>
      </form>

      {isLoading && <ToolLoadingState message="Sedang mencari ide nama..." />}

      {!isLoading && error && (
        <ToolErrorState message={error} onRetry={() => lastValues && generate(lastValues)} />
      )}

      {!isLoading && !error && result && (
        <div className="flex flex-col gap-4">
          {result.names.map((item, i) => (
            <ResultCard
              key={item.name}
              title={item.name}
              badge={i + 1}
              copyText={`${item.name} — ${item.tagline}`}
            >
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium italic text-primary">&ldquo;{item.tagline}&rdquo;</p>
                <p className="text-sm text-neutral-600">{item.reason}</p>
              </div>
            </ResultCard>
          ))}
        </div>
      )}
    </div>
  );
}
