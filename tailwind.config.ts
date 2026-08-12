import type { Config } from "tailwindcss";

function colorScale(prefix: string): Record<string, string> {
  const stops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  return Object.fromEntries(
    stops.map((stop) => [stop, `hsl(var(--color-${prefix}-${stop}))`]),
  );
}

const config: Config = {
  darkMode: "media",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          ...colorScale("primary"),
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          ...colorScale("accent"),
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        neutral: colorScale("neutral"),
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        "glow-primary": "0 0 44px -10px hsl(var(--color-primary-500) / 0.55)",
        "glow-accent": "0 0 44px -10px hsl(var(--color-accent-400) / 0.6)",
        "glow-accent-lg": "0 0 90px -18px hsl(var(--color-accent-400) / 0.5)",
        elevate: "0 18px 50px -22px hsl(var(--color-neutral-950) / 0.5)",
      },
      backgroundImage: {
        "gradient-gold":
          "linear-gradient(110deg, hsl(var(--color-accent-200)), hsl(var(--color-accent-400)))",
        "gradient-emerald":
          "linear-gradient(135deg, hsl(var(--color-primary-400)), hsl(var(--color-primary-700)))",
        /* Sampul buku resep — olive tua ke sage hangat, sentuhan krem */
        "gradient-kitab":
          "linear-gradient(150deg, hsl(var(--color-primary-700)) 0%, hsl(var(--color-primary-500)) 45%, hsl(82 25% 38%) 100%)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
