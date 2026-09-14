"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Hash, MessageCircleMore, PenLine, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResultCard } from "@/components/tools/result-card";
import { ToolErrorState, ToolLoadingState } from "@/components/tools/tool-status";

const formSchema = z.object({
  namaProduk: z.string().trim().min(2, "Isi dulu nama produk/jasanya"),
  targetPembeli: z.enum(["ibu-ibu", "anak-muda", "siapa-saja", "kantoran"], {
    message: "Pilih target pembeli",
  }),
  platform: z.enum(["wa-status", "ig-feed-story", "facebook", "tiktok"], {
    message: "Pilih platform posting",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type TulisanPromosiResult = {
  caption: string;
  storyIdeas: string[];
  hashtags: string[];
  chatTemplate: string;
};

export function TulisanPromosiForm() {
  const [result, setResult] = useState<TulisanPromosiResult | null>(null);
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
      const res = await fetch("/api/tulisan-promosi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Terjadi kesalahan.");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat tulisan promosi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit(generate)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="namaProduk" className="text-sm font-medium text-foreground">
            Nama produk/jasa
          </label>
          <Input
            id="namaProduk"
            placeholder="Contoh: Nasi Box Ayam Geprek, Kue Brownies Kukus, Es Teh Gula Aren"
            invalid={!!errors.namaProduk}
            {...register("namaProduk")}
          />
          {errors.namaProduk && <p className="text-xs text-red-500">{errors.namaProduk.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="targetPembeli" className="text-sm font-medium text-foreground">
            Target pembeli
          </label>
          <Select
            id="targetPembeli"
            defaultValue=""
            invalid={!!errors.targetPembeli}
            {...register("targetPembeli")}
          >
            <option value="" disabled>
              Pilih target pembeli
            </option>
            <option value="ibu-ibu">Ibu-ibu sekitar rumah</option>
            <option value="anak-muda">Anak muda & remaja</option>
            <option value="siapa-saja">Siapa saja</option>
            <option value="kantoran">Orang kantoran</option>
          </Select>
          {errors.targetPembeli && <p className="text-xs text-red-500">{errors.targetPembeli.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="platform" className="text-sm font-medium text-foreground">
            Platform posting
          </label>
          <Select id="platform" defaultValue="" invalid={!!errors.platform} {...register("platform")}>
            <option value="" disabled>
              Pilih platform posting
            </option>
            <option value="wa-status">Status WA / chat</option>
            <option value="ig-feed-story">Instagram feed & story</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </Select>
          {errors.platform && <p className="text-xs text-red-500">{errors.platform.message}</p>}
        </div>

        <Button type="submit" variant="primary" size="lg" disabled={isLoading} className="mt-2">
          {isLoading ? (
            "Sedang membuat caption promosi..."
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Buatkan Caption Promosi Saya
            </>
          )}
        </Button>
      </form>

      {isLoading && <ToolLoadingState message="Sedang membuat caption promosi..." />}

      {!isLoading && error && (
        <ToolErrorState message={error} onRetry={() => lastValues && generate(lastValues)} />
      )}

      {!isLoading && !error && result && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ResultCard title="Caption Siap Pakai" badge={<PenLine className="h-3.5 w-3.5" />} copyText={result.caption}>
            <p className="text-sm text-neutral-600">{result.caption}</p>
          </ResultCard>

          <ResultCard
            title="Ide Story / Status"
            badge={<Sparkles className="h-3.5 w-3.5" />}
            copyText={result.storyIdeas.map((s, i) => `${i + 1}. ${s}`).join("\n")}
          >
            <ul className="flex flex-col gap-1.5 text-sm text-neutral-600">
              {result.storyIdeas.map((idea, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary">{i + 1}.</span>
                  <span>{idea}</span>
                </li>
              ))}
            </ul>
          </ResultCard>

          <ResultCard
            title="Hashtag Relevan"
            badge={<Hash className="h-3.5 w-3.5" />}
            copyText={result.hashtags.join(" ")}
          >
            <div className="flex flex-wrap gap-2">
              {result.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ResultCard>

          <ResultCard
            title="Template Balasan Chat"
            badge={<MessageCircleMore className="h-3.5 w-3.5" />}
            copyText={result.chatTemplate}
          >
            <p className="text-sm text-neutral-600">{result.chatTemplate}</p>
          </ResultCard>
        </div>
      )}
    </div>
  );
}
