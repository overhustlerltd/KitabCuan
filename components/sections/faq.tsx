"use client";

import { motion, type Variants } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_CONTENT } from "@/lib/constants";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function Faq() {
  return (
    <section id="faq" className="bg-background py-16 md:py-24 border-t border-border">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col gap-3 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {FAQ_CONTENT.headline}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-neutral-600 sm:text-xl">
            {FAQ_CONTENT.subheadline}
          </motion.p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 rounded-3xl border-2 border-border bg-card px-6 py-2 sm:px-8 shadow-sm"
        >
          <Accordion defaultValue="item-0">
            {FAQ_CONTENT.items.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger className="text-base font-bold sm:text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-neutral-700">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
