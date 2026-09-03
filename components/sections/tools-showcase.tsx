"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { TOOLS_PAGE_CONTENT, TOOLS_NAV_LINK } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export function ToolsShowcase() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-8 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeInUp}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-300/40 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary">
            <Sparkles className="h-4 w-4" />
            {TOOLS_PAGE_CONTENT.badge}
          </span>
          <h2 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {TOOLS_PAGE_CONTENT.title}
          </h2>
          <p className="mt-3 text-lg text-foreground/70">{TOOLS_PAGE_CONTENT.subtitle}</p>
        </motion.div>

        {/* Carousel preview */}
        <div className="relative mt-12">
          <button
            type="button"
            aria-label="Tool sebelumnya"
            onClick={() => scrollByCard(-1)}
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-elevate transition hover:bg-primary-50 hover:text-primary md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Tool berikutnya"
            onClick={() => scrollByCard(1)}
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-elevate transition hover:bg-primary-50 hover:text-primary md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:px-14 [&::-webkit-scrollbar]:hidden"
          >
            {TOOLS_PAGE_CONTENT.tabs.map((tab) => {
              const Icon = ICON_MAP[tab.icon];
              return (
                <div
                  key={tab.value}
                  data-card
                  className="w-[82%] shrink-0 snap-center sm:w-[46%] lg:w-[31%]"
                >
                  <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-lg font-bold text-card-foreground">{tab.cardTitle}</h3>
                    <p className="text-sm leading-relaxed text-foreground/70">{tab.cardDescription}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-neutral-500 md:hidden">
          Geser ke kanan untuk lihat tool lainnya →
        </p>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
          className="mt-10 text-center"
        >
          <Link
            href={TOOLS_NAV_LINK.href}
            className={buttonVariants({
              variant: "accent",
              size: "lg",
              className: "px-8 py-4 text-base font-black tracking-wide shadow-glow-accent sm:text-lg",
            })}
          >
            Coba Tools AI Dapur Sekarang
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
