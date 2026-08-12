import Link from "next/link";
import { AtSign, ChefHat, Globe, Mail, MessageCircle, Share2 } from "lucide-react";
import { FOOTER_LINK_GROUPS, SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants";

const SOCIAL_ICONS = [Globe, Mail, MessageCircle, Share2];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-neutral-100/90 text-neutral-600">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex w-fit items-center gap-2" aria-label={SITE_CONFIG.name}>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <ChefHat className="h-4 w-4" />
              </span>
              <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
                {SITE_CONFIG.nameParts.first}
                <span className="text-gradient-gold">{SITE_CONFIG.nameParts.second}</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-neutral-600">{SITE_CONFIG.tagline}.</p>
          </div>

          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-semibold text-foreground">{group.title}</h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col-reverse items-center gap-4 border-t border-border pt-6 md:flex-row md:justify-between">
          <p className="text-xs text-neutral-500">
            &copy; {year} {SITE_CONFIG.name}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social, index) => {
              const Icon = SOCIAL_ICONS[index] ?? AtSign;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
