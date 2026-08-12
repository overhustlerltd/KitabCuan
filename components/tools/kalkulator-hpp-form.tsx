"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Plus, Sparkles, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/tools/copy-button";
import { ToolErrorState, ToolLoadingState } from "@/components/tools/tool-status";

const bahanSchema = z.object({
  nama: z.string().trim().min(1, "Wajib diisi"),
  harga: z.coerce.number().min(1, "Wajib diisi"),
  satuan: z.string().trim().min(1, "Wajib diisi"),
});

const formSchema = z.object({
  namaProduk: z.string().trim().min(2, "Isi nama produk dulu"),
  bahan: z.array(bahanSchema).min(1, "Tambahkan minimal satu bahan"),
  biayaGas: z.coerce.number().nonnegative().optional().transform((v) => v ?? 0),
  biayaKemasan: z.coerce.number().nonnegative().optional().transform((v) => v ?? 0),
  biayaLainnya: z.coerce.number().nonnegative().optional().transform((v) => v ?? 0),
  jumlahPorsi: z.coerce.number().min(1, "Minimal 1 porsi"),
  marginKeuntungan: z.coerce.number().min(1, "Minimal 1%").max(500, "Maksimal 500%"),
});

// Manually defined to avoid TypeScript issues with z.coerce + zodResolver
type FormValues = {
  namaProduk: string;
  bahan: { nama: string; harga: number; satuan: string }[];
  biayaGas?: number;
  biayaKemasan?: number;
  biayaLainnya?: number;
  jumlahPorsi: number;
  marginKeuntungan: number;
};

type HppResult = {
  totalBiayaBahan: number;
  totalBiayaOperasional: number;
  totalHpp: number;
  hppPerPorsi: number;
  hargaJualRekomendasi: number;
  keuntunganPerPorsi: number;
  breakEvenPorsi: number;
  analisis: string;
};

function formatRupiah(num: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(num);
}

export function KalkulatorHppForm() {
  const [result, setResult] = useState<HppResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastValues, setLastValues] = useState<FormValues | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      bahan: [{ nama: "", harga: undefined as unknown as number, satuan: "" }],
      biayaGas: 0,
      biayaKemasan: 0,
      biayaLainnya: 0,
      marginKeuntungan: 30,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "bahan" });

  const generate = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);
    setLastValues(values);
    try {
      const res = await fetch("/api/kalkulator-hpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghitung HPP.");
    } finally {
      setIsLoading(false);
    }
  };

  const resultText = result
    ? `HPP Kalkulator — ${lastValues?.namaProduk}
Total Biaya Bahan: ${formatRupiah(result.totalBiayaBahan)}
Total Biaya Operasional: ${formatRupiah(result.totalBiayaOperasional)}
Total HPP: ${formatRupiah(result.totalHpp)}
HPP per Porsi: ${formatRupiah(result.hppPerPorsi)}
Harga Jual Rekomendasi: ${formatRupiah(result.hargaJualRekomendasi)}
Keuntungan per Porsi: ${formatRupiah(result.keuntunganPerPorsi)}
Break-even (porsi/hari): ${result.breakEvenPorsi} porsi
Analisis: ${result.analisis}`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(generate)} className="flex flex-col gap-5">
        {/* Nama Produk */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="namaProduk" className="text-sm font-medium text-foreground">
            Nama produk masakan
          </label>
          <Input
            id="namaProduk"
            placeholder="Contoh: Nasi Goreng Spesial, Kue Brownies Kukus"
            invalid={!!errors.namaProduk}
            {...register("namaProduk")}
          />
          {errors.namaProduk && <p className="text-xs text-red-500">{errors.namaProduk.message}</p>}
        </div>

        {/* Daftar Bahan */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Daftar bahan-bahan</label>
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Nama bahan"
                    invalid={!!errors.bahan?.[index]?.nama}
                    {...register(`bahan.${index}.nama`)}
                    className="flex-[2]"
                  />
                  <Input
                    type="number"
                    placeholder="Harga (Rp)"
                    min={0}
                    invalid={!!errors.bahan?.[index]?.harga}
                    {...register(`bahan.${index}.harga`)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Satuan"
                    invalid={!!errors.bahan?.[index]?.satuan}
                    {...register(`bahan.${index}.satuan`)}
                    className="flex-1"
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => append({ nama: "", harga: 0, satuan: "" })}
            className="flex items-center gap-1.5 self-start rounded-lg border border-dashed border-border px-3 py-1.5 text-sm text-neutral-500 transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah bahan
          </button>
          {errors.bahan && typeof errors.bahan === "object" && "message" in errors.bahan && (
            <p className="text-xs text-red-500">{errors.bahan.message as string}</p>
          )}
        </div>

        {/* Biaya Operasional */}
        <div className="rounded-xl border border-border bg-neutral-50/80 p-4">
          <p className="mb-3 text-sm font-medium text-foreground">Biaya operasional</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="biayaGas" className="text-xs text-neutral-500">
                Biaya gas/listrik (Rp)
              </label>
              <Input
                id="biayaGas"
                type="number"
                min={0}
                placeholder="0"
                {...register("biayaGas")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="biayaKemasan" className="text-xs text-neutral-500">
                Biaya kemasan (Rp)
              </label>
              <Input
                id="biayaKemasan"
                type="number"
                min={0}
                placeholder="0"
                {...register("biayaKemasan")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="biayaLainnya" className="text-xs text-neutral-500">
                Biaya lainnya (Rp)
              </label>
              <Input
                id="biayaLainnya"
                type="number"
                min={0}
                placeholder="0"
                {...register("biayaLainnya")}
              />
            </div>
          </div>
        </div>

        {/* Porsi & Margin */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="jumlahPorsi" className="text-sm font-medium text-foreground">
              Jumlah porsi / batch
            </label>
            <Input
              id="jumlahPorsi"
              type="number"
              min={1}
              placeholder="Contoh: 10"
              invalid={!!errors.jumlahPorsi}
              {...register("jumlahPorsi")}
            />
            {errors.jumlahPorsi && <p className="text-xs text-red-500">{errors.jumlahPorsi.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="marginKeuntungan" className="text-sm font-medium text-foreground">
              Target margin keuntungan (%)
            </label>
            <Input
              id="marginKeuntungan"
              type="number"
              min={1}
              max={500}
              placeholder="Contoh: 30"
              invalid={!!errors.marginKeuntungan}
              {...register("marginKeuntungan")}
            />
            {errors.marginKeuntungan && <p className="text-xs text-red-500">{errors.marginKeuntungan.message}</p>}
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
          {isLoading ? (
            "Sedang menghitung HPP..."
          ) : (
            <>
              <Calculator className="h-4 w-4" />
              Hitung HPP & Harga Jual
            </>
          )}
        </Button>
      </form>

      {isLoading && <ToolLoadingState message="Sedang menghitung HPP dan rekomendasi harga..." />}

      {!isLoading && error && (
        <ToolErrorState message={error} onRetry={() => lastValues && generate(lastValues)} />
      )}

      {!isLoading && !error && result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">
              Hasil HPP — {lastValues?.namaProduk}
            </h3>
            <CopyButton text={resultText} label="Salin Hasil" />
          </div>

          {/* Highlight Cards */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-neutral-500">HPP per Porsi</p>
              <p className="font-heading text-2xl font-bold text-foreground">
                {formatRupiah(result.hppPerPorsi)}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-accent-400/30 bg-accent-400/5 p-4">
              <p className="text-xs font-semibold text-accent-700">Harga Jual Rekomendasi</p>
              <p className="font-heading text-2xl font-bold text-accent-700">
                {formatRupiah(result.hargaJualRekomendasi)}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs text-primary/70">Keuntungan per Porsi</p>
              <p className="font-heading text-2xl font-bold text-primary">
                {formatRupiah(result.keuntunganPerPorsi)}
              </p>
            </div>
          </div>

          {/* Detail */}
          <div className="rounded-xl border border-border bg-card p-4">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-2 text-neutral-500">Total biaya bahan</td>
                  <td className="py-2 text-right font-medium text-foreground">
                    {formatRupiah(result.totalBiayaBahan)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-500">Total biaya operasional</td>
                  <td className="py-2 text-right font-medium text-foreground">
                    {formatRupiah(result.totalBiayaOperasional)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold text-foreground">Total HPP</td>
                  <td className="py-2 text-right font-bold text-foreground">
                    {formatRupiah(result.totalHpp)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-neutral-500">Break-even harian</td>
                  <td className="py-2 text-right font-medium text-foreground">
                    {result.breakEvenPorsi} porsi
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Analisis AI */}
          <div className="flex gap-3 rounded-xl border border-border bg-muted p-4">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <p className="text-sm text-foreground">{result.analisis}</p>
          </div>
        </div>
      )}
    </div>
  );
}
