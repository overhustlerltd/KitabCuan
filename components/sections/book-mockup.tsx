import { BookOpen, TrendingUp, UtensilsCrossed } from "lucide-react";
import { HERO_CONTENT } from "@/lib/constants";

const RECIPE_ITEMS = [
  { emoji: "🍜", name: "Mie Goreng Spesial" },
  { emoji: "🍱", name: "Nasi Box Ayam" },
  { emoji: "🧁", name: "Kue Kering Lebaran" },
];

export function BookMockup({ showCards = true }: { showCards?: boolean }) {
  return (
    <div
      className="relative mx-auto w-full max-w-[17rem] sm:max-w-[19rem]"
      style={{ perspective: 1400 }}
    >
      <div className="pointer-events-none absolute -inset-10 -z-10 animate-pulse-glow rounded-full bg-primary-400/15 blur-3xl" />

      {/* Sampul Buku Resep */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-l-md rounded-r-2xl bg-gradient-kitab shadow-elevate ring-1 ring-primary-400/30">
        {/* Book spine */}
        <div className="absolute inset-y-0 left-0 w-4 bg-primary-950/50" />
        <div className="absolute inset-y-0 left-4 w-px bg-primary-300/30" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-50/5 to-primary-50/10" />

        {/* Decorative dots pattern on upper right */}
        <div className="absolute right-4 top-4 grid grid-cols-4 gap-1 opacity-20">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="h-1 w-1 rounded-full bg-primary-100" />
          ))}
        </div>

        <div className="relative flex h-full flex-col justify-between p-6 pl-9 sm:p-7 sm:pl-11">
          {/* Edition badge */}
          <span className="w-fit rounded-full border border-primary-300/30 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-primary-200">
            {HERO_CONTENT.bookEdition}
          </span>

          {/* Book title area */}
          <div>
            {/* Mini decorative recipe list */}
            <div className="mb-4 flex flex-col gap-1.5">
              {RECIPE_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2 rounded-lg bg-primary-950/30 px-2.5 py-1.5 backdrop-blur-sm"
                >
                  <span className="text-sm">{item.emoji}</span>
                  <span className="text-[0.65rem] font-medium text-primary-100/90">{item.name}</span>
                </div>
              ))}
            </div>

            <p className="font-heading text-4xl font-extrabold leading-none tracking-tight text-primary-50 sm:text-5xl">
              {HERO_CONTENT.bookTitleTop}
            </p>
            <p className="text-gradient-gold-on-dark font-heading text-4xl font-extrabold leading-none tracking-tight sm:text-5xl">
              {HERO_CONTENT.bookTitleBottom}
            </p>
            <div className="mt-4 h-px w-14 bg-accent-300/60" />
            <p className="mt-3 max-w-[14rem] text-xs leading-relaxed text-primary-100/80">
              Dari dapur rumah sampai rekening cuan pertama.
            </p>
          </div>

          <UtensilsCrossed className="h-7 w-7 text-primary-300/60" strokeWidth={1.5} />
        </div>
      </div>

      {showCards && (
        <>
          {/* Floating stat card — bottom left */}
          <div className="absolute -bottom-5 -left-4 flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-elevate sm:-left-6 sm:p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-400/15">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{HERO_CONTENT.statCardLabel}</p>
              <p className="text-sm font-bold text-card-foreground">{HERO_CONTENT.statCardValue}</p>
            </div>
          </div>

          {/* Floating chapter card — top right */}
          <div className="absolute -right-3 top-8 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-elevate sm:-right-5">
            <BookOpen className="h-4 w-4 text-primary" />
            <div>
              <p className="text-[0.65rem] leading-tight text-muted-foreground">
                {HERO_CONTENT.chapterCardLabel}
              </p>
              <p className="text-xs font-bold leading-tight text-card-foreground">
                {HERO_CONTENT.chapterCardValue}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
