import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkle, Languages, Zap, Shield, Layers } from "lucide-react";

import heroImg from "@/assets/hero-aurora.jpg";
import { useI18n } from "@/lib/i18n";
import { TOOLS, TOOL_CATEGORIES, ACCENT_CLASSES, type ToolCategory } from "@/lib/tools-catalog";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AIVIO — Your AI Bestie | 24+ AI Tools in Hindi & English" },
      { name: "description", content: "AIVIO is a futuristic AI workspace for Bharat — chat, homework, resume, captions, reels, image generation and 20+ more tools in Hindi & English." },
      { name: "keywords", content: "AI tools, Hindi AI, AI chat, resume builder, AI image generator, YouTube titles, reel script, hashtag generator, AIVIO" },
      { property: "og:title", content: "AIVIO — 24+ AI Tools in Hindi & English" },
      { property: "og:description", content: "One futuristic workspace for chat, study, writing, social and creator tools — built for Bharat." },
      { property: "og:url", content: "https://aivio.lovable.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AIVIO — Your AI Bestie" },
      { name: "twitter:description", content: "24+ AI tools in one futuristic workspace. Hindi & English." },
    ],
    links: [{ rel: "canonical", href: "https://aivio.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "AIVIO",
          applicationCategory: "ProductivityApplication",
          operatingSystem: "Web",
          description: "Futuristic AI workspace with 24+ tools in Hindi & English.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
        }),
      },
    ],
  }),
  component: LandingPage,
});

// Nav and LangToggle moved to src/components/site-nav.tsx

function Hero() {
  const { t, lang } = useI18n();
  return (
    <header className="relative overflow-hidden px-4 pt-12 pb-20 sm:px-6 sm:pt-20 sm:pb-28">
      <div className="grid-overlay absolute inset-0 opacity-60" />
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7 animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {t("hero.badge")}
          </div>
          <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            {t("hero.title.a")}
            <br />
            <span className="text-gradient-aurora">{t("hero.title.b")}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">{t("hero.subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#tools"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-primary-foreground glow-aurora transition-transform hover:scale-[1.02]"
            >
              {t("hero.cta.secondary")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#tools"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-semibold text-foreground hover:bg-surface"
            >
              {lang === "hi" ? "Tools test करें" : "Test tools"}
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5 text-accent" /> 13+ AI tools</span>
            <span className="inline-flex items-center gap-1.5"><Languages className="size-3.5 text-accent" /> हिंदी + English</span>
            <span className="inline-flex items-center gap-1.5"><Shield className="size-3.5 text-accent" /> Secure cloud</span>
          </div>
        </div>
        <div className="relative lg:col-span-5 animate-fade-up">
          <div className="absolute -inset-10 rounded-[2rem] bg-gradient-aurora opacity-20 blur-3xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl">
            <img
              src={heroImg}
              alt="AIVIO neural aurora visualization"
              width={1536}
              height={1024}
              className="h-auto w-full"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs">
                <Sparkle className="size-4 text-accent" />
                <span className="font-medium">{lang === "hi" ? "AIVIO इंजन 2.0" : "AIVIO Engine 2.0"}</span>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ToolsGrid() {
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<"all" | ToolCategory>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (cat !== "all" && tool.category !== cat) return false;
      if (!q) return true;
      return (
        tool.name.en.toLowerCase().includes(q) ||
        tool.name.hi.includes(q) ||
        tool.tagline.en.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  return (
    <section id="tools" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-4xl font-bold">{t("tools.heading")}</h2>
            <p className="mt-2 text-muted-foreground">
              {lang === "hi" ? "अपनी रचनात्मकता को बढ़ावा दें।" : "Pick a tool and start creating."}
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("tools.search")}
              className="w-full rounded-2xl border border-border bg-surface/60 py-3 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {TOOL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                cat === c.id
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang === "hi" ? c.hi : c.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((tool) => {
            const a = ACCENT_CLASSES[tool.accent];
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to="/tools/$toolId"
                params={{ toolId: tool.id }}
                className={`group relative flex flex-col rounded-2xl border border-border bg-surface/60 p-6 transition-all ${a.ring}`}
              >
                <div className={`mb-5 flex size-12 items-center justify-center rounded-xl ${a.bg}`}>
                  <Icon className={`size-5 ${a.text}`} />
                </div>
                {tool.badge && (
                  <span className="absolute right-4 top-4 rounded-full border border-border bg-background/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {lang === "hi" ? tool.badge.hi : tool.badge.en}
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold">
                  {lang === "hi" ? tool.name.hi : tool.name.en}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {lang === "hi" ? tool.tagline.hi : tool.tagline.en}
                </p>
                <div className="mt-6 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{tool.category}</span>
                  <span className={`inline-flex items-center gap-1 font-medium ${a.text} transition-transform group-hover:translate-x-0.5`}>
                    {t("tools.launch")} <ArrowRight className="size-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { lang } = useI18n();
  const items = [
    {
      icon: Layers,
      en: { t: "All-in-one workspace", d: "Switch between 13+ AI tools without leaving the app." },
      hi: { t: "एक ही जगह सब कुछ", d: "13+ AI टूल्स, एक ही वर्कस्पेस में।" },
    },
    {
      icon: Languages,
      en: { t: "Hindi + English fluent", d: "Outputs that sound natural in both languages." },
      hi: { t: "हिंदी और अंग्रेज़ी", d: "दोनों भाषाओं में सहज परिणाम।" },
    },
    {
      icon: Shield,
      en: { t: "Secure cloud", d: "Your chats stay private with encrypted storage." },
      hi: { t: "सुरक्षित क्लाउड", d: "आपकी बातचीत निजी और सुरक्षित।" },
    },
  ];
  return (
    <section className="border-y border-border bg-surface/30 px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
        {items.map((it) => {
          const Icon = it.icon;
          const copy = lang === "hi" ? it.hi : it.en;
          return (
            <div key={copy.t} className="rounded-2xl border border-border bg-background/40 p-6">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{copy.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{copy.d}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CTA() {
  const { lang } = useI18n();
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-3xl rounded-3xl border border-border bg-surface/60 p-12 text-center backdrop-blur-md">
        <h2 className="font-display text-4xl font-bold">
          {lang === "hi" ? "पहले tools test करें।" : "Test the tools first."}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          {lang === "hi"
            ? "बिना signup flow में फँसे AIVIO workspace खोलें और AI response देखें।"
            : "Open the AIVIO workspace and check AI responses without getting stuck in signup."}
        </p>
        <a
          href="#tools"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-6 py-3 text-sm font-semibold text-primary-foreground glow-aurora"
        >
          {lang === "hi" ? "AI Tools खोलें" : "Open AI tools"}
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <Features />
      <ToolsGrid />
      <CTA />
      <SiteFooter />
    </div>
  );
}
