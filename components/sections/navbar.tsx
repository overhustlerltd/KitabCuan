"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChefHat, Menu, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_CONFIG, TOOLS_NAV_LINK } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <ChefHat className="h-4 w-4" />
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
        {SITE_CONFIG.nameParts.first}
        <span className="text-gradient-gold">{SITE_CONFIG.nameParts.second}</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full border-b border-transparent bg-background/90 backdrop-blur-md transition-shadow",
        isScrolled && "border-border shadow-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" aria-label={SITE_CONFIG.name}>
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral-700 transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={TOOLS_NAV_LINK.href}
            className="flex items-center gap-1.5 rounded-full border border-primary-300/50 bg-primary-50 px-3.5 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-100/70"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {TOOLS_NAV_LINK.label}
          </Link>
        </nav>

        <Link
          href="/#harga"
          className={buttonVariants({
            variant: "accent",
            size: "md",
            className: "hidden shadow-glow-accent font-semibold md:inline-flex",
          })}
        >
          Ambil Kitabnya
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Buka menu"
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen} />
      <SheetContent open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <Wordmark />
        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-neutral-700 transition-colors hover:bg-muted hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={TOOLS_NAV_LINK.href}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1.5 rounded-md px-3 py-2 text-base font-semibold text-primary transition-colors hover:bg-primary-50"
          >
            <Sparkles className="h-4 w-4" />
            {TOOLS_NAV_LINK.label}
          </Link>
        </nav>
        <Link
          href="/#harga"
          onClick={() => setIsMenuOpen(false)}
          className={buttonVariants({
            variant: "accent",
            size: "lg",
            className: "mt-auto w-full shadow-glow-accent font-semibold",
          })}
        >
          Ambil Kitabnya
        </Link>
      </SheetContent>
    </header>
  );
}
