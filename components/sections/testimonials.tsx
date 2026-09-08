"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS_CONTENT } from "@/lib/constants";

export function Testimonials() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  // Auto-slide ke kanan (marquee kontinu via rAF), berhenti saat hover/sentuh.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let paused = false;
    let pos = el.scrollLeft;
    let raf = 0;
    const SPEED = 0.7; // px per frame (~42px/detik)

    const pause = () => {
      paused = true;
    };
    const resume = () => {
      pos = el.scrollLeft; // sync setelah interaksi manual
      paused = false;
    };
    el.addEventListener("pointerenter", pause);
    el.addEventListener("pointerleave", resume);
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });

    const step = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (!paused && max > 1) {
        pos += SPEED;
        if (pos >= max) pos = 0;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", pause);
      el.removeEventListener("pointerleave", resume);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
    };
  }, []);

  return (
    <section id="testimoni" className="border-b border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {TESTIMONIALS_CONTENT.eyebrow}
          </h2>
          <p className="mt-3 text-lg text-neutral-600">{TESTIMONIALS_CONTENT.headline}</p>
        </motion.div>

        <div className="relative mt-12">
          <button
            type="button"
            aria-label="Testimoni sebelumnya"
            onClick={() => scrollByCard(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-elevate transition hover:bg-primary-50 hover:text-primary md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Testimoni berikutnya"
            onClick={() => scrollByCard(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-elevate transition hover:bg-primary-50 hover:text-primary md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex items-start gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-14 [&::-webkit-scrollbar]:hidden"
          >
            {TESTIMONIALS_CONTENT.images.map((src, i) => (
              <div
                key={src}
                data-card
                className="w-[80%] shrink-0 snap-center sm:w-[46%] md:w-[31%]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Testimoni pengguna KitabCuan ${i + 1}`}
                  loading="lazy"
                  className="w-full rounded-2xl border border-border shadow-elevate"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500 md:hidden">
          Geser ke kanan/kiri untuk lihat testimoni lainnya →
        </p>
      </div>
    </section>
  );
}
