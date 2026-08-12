"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const AccordionContext = createContext<{
  openValue: string | null;
  toggle: (value: string) => void;
} | null>(null);

const AccordionItemContext = createContext<string | null>(null);

interface AccordionProps {
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

export function Accordion({ defaultValue, children, className }: AccordionProps) {
  const [openValue, setOpenValue] = useState<string | null>(defaultValue ?? null);

  const toggle = (value: string) => {
    setOpenValue((current) => (current === value ? null : value));
  };

  return (
    <AccordionContext.Provider value={{ openValue, toggle }}>
      <div className={cn("flex flex-col divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn("py-2", className)}>{children}</div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  if (!ctx || value === null) return null;
  const isOpen = ctx.openValue === value;

  return (
    <button
      type="button"
      onClick={() => ctx.toggle(value)}
      aria-expanded={isOpen}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-4 text-left font-heading text-base font-semibold text-foreground",
        className,
      )}
    >
      {children}
      <ChevronDown
        className={cn("h-5 w-5 shrink-0 text-neutral-500 transition-transform duration-200", isOpen && "rotate-180")}
      />
    </button>
  );
}

export function AccordionContent({ children, className }: { children: ReactNode; className?: string }) {
  const ctx = useContext(AccordionContext);
  const value = useContext(AccordionItemContext);
  if (!ctx || value === null) return null;
  const isOpen = ctx.openValue === value;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className={cn("pb-4 text-sm text-neutral-600 dark:text-neutral-400", className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
