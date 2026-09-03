"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, BookOpen, ChefHat, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { HERO_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Social proof avatars. Set `src` ke path foto di /public (mis. "/avatars/1.jpg")
// untuk menampilkan foto asli; kalau kosong, tampil ikon silhouette sebagai fallback.
const AVATARS = [
  { src: "/avatars/1.png", tone: "bg-primary-400" },
  { src: "/avatars/2.png", tone: "bg-primary-500" },
  { src: "/avatars/3.png", tone: "bg-primary-600" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 md:grid-cols-2 md:gap-12 md:px-8 md:py-24">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col gap-6"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-300/40 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary"
          >
            <ChefHat className="h-4 w-4 text-primary" />
            {HERO_CONTENT.eyebrow}
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="font-heading text-[2.75rem] font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-[4rem]"
          >
            {HERO_CONTENT.headlineLine1}
            <br />
            <span className="text-gradient-gold">{HERO_CONTENT.headlineLine2}</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="max-w-lg text-lg font-bold leading-snug text-foreground sm:text-xl"
          >
            {HERO_CONTENT.subheadlineLead}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="max-w-lg text-lg leading-relaxed text-neutral-600 sm:text-xl"
          >
            {HERO_CONTENT.subheadline}
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={HERO_CONTENT.primaryCta.href}
              className={buttonVariants({
                variant: "accent",
                size: "lg",
                className: "shadow-glow-accent whitespace-nowrap px-4 py-3.5 text-sm font-black tracking-wide sm:px-7 sm:py-4 sm:text-base",
              })}
            >
              {HERO_CONTENT.primaryCta.label}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </a>
            <a
              href={HERO_CONTENT.secondaryCta.href}
              className="group inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap px-2 py-3 text-base font-bold text-foreground transition-colors hover:text-primary"
            >
              <BookOpen className="h-5 w-5" />
              {HERO_CONTENT.secondaryCta.label}
            </a>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
            <div className="flex -space-x-3">
              {AVATARS.map((avatar) => (
                <div
                  key={avatar.src}
                  className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-cover bg-center ${avatar.tone}`}
                  style={avatar.src ? { backgroundImage: `url(${avatar.src})` } : undefined}
                >
                  {!avatar.src && <User className="h-5 w-5 text-white/90" strokeWidth={2} />}
                </div>
              ))}
              <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-background bg-accent-500 text-[0.72rem] font-black leading-none tracking-tight text-white">
                3RB+
              </div>
            </div>
            <p className="text-sm">
              <span className="font-semibold text-foreground">{HERO_CONTENT.socialProofCount}</span>{" "}
              <span className="text-neutral-600">{HERO_CONTENT.socialProofLabel}</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Product Design Visual (PNG) */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative mx-auto w-full max-w-[23rem] sm:max-w-md md:mx-0 md:justify-self-end"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/kitabcuan-cover.png"
            alt="KitabCuan — Panduan Digital Bisnis"
            width={860}
            height={1040}
            className="h-auto w-full select-none"
            draggable={false}
          />
        </motion.div>
      </div>
    </section>
  );
}
