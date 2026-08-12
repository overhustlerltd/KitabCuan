"use client";

import { motion, type Variants } from "framer-motion";
import { Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BONUS_CONTENT } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icons";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Bonus() {
  return (
    <section id="bonus" className="bg-neutral-100/50 py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="overflow-hidden rounded-3xl border-2 border-accent-300/60 bg-card shadow-md"
        >
          <div className="flex flex-col gap-3 border-b border-accent-200 bg-accent-50/70 px-6 py-8 text-center sm:px-10">
            <motion.div variants={fadeInUp} className="mx-auto">
              <Badge variant="accent" className="px-4 py-1.5 text-base font-bold">
                <Gift className="h-4 w-4" />
                {BONUS_CONTENT.eyebrow}
              </Badge>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-4xl"
            >
              {BONUS_CONTENT.headline}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-base text-neutral-700 sm:text-lg font-medium">
              {BONUS_CONTENT.subheadline}
            </motion.p>
          </div>

          <div className="flex flex-col divide-y divide-border px-6 sm:px-10">
            {BONUS_CONTENT.items.map((item) => {
              const Icon = ICON_MAP[item.icon];
              return (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="flex items-center gap-4 py-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-100 text-accent-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="flex-1 text-base font-bold text-foreground sm:text-lg">{item.title}</p>
                  <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700">
                    GRATIS <span className="text-neutral-400 line-through text-xs ml-1">{item.value}</span>
                  </span>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-1.5 bg-accent-50/50 px-6 py-8 text-center sm:px-10 border-t border-border"
          >
            <p className="text-base font-bold text-neutral-600">{BONUS_CONTENT.totalLabel}</p>
            <p className="text-gradient-gold font-heading text-5xl font-black">
              {BONUS_CONTENT.totalValue}
            </p>
            <p className="mt-1 text-base font-extrabold text-primary">🎉 {BONUS_CONTENT.totalNote}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
