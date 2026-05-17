import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search, Sparkle, Languages, Zap, Shield, Layers } from "lucide-react";

import heroImg from "@/assets/hero-aurora.jpg";
import { useI18n, type Lang } from "@/lib/i18n";
import { TOOLS, TOOL_CATEGORIES, ACCENT_CLASSES, type ToolCategory } from "@/lib/tools-catalog";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LangToggle() {
  const { lang, setLang } = useI18n();
  const opts: Lang[] = ["en", "hi"];
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-xs">
      {opts.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${
            lang === l ? "bg-gradient-aurora text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

function Nav() {
  const { t } = useI18n();
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-aurora glow-aurora" />
          <span className="font-display text-lg font-bold tracking-tight">AIDost</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#tools" className="transition-colors hover:text-foreground">{t("nav.tools")}</a>
          <Link to="/about" className="transition-colors hover:text-foreground">{t("nav.about")}</Link>
          <Link to="/contact" className="transition-colors hover:text-foreground">{t("nav.contact")}</Link>
        </div>
        <div className="flex items-center gap-3">
          <LangToggle />
          <Link
            to="/login"
            className="rounded-full border border-border bg-surface/50 px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface"
          >
            {t("nav.login")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  const { t, lang } = useI18n();
  return (
    <header className="relative overflow-hidden px-6 pt-20 pb-28">
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
              alt="AIDost neural aurora visualization"
              width={1536}
              height={1024}
              className="h-auto w-full"
            />
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-border bg-background/70 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs">
                <Sparkle className="size-4 text-accent" />
                <span className="font-medium">{lang === "hi" ? "दोस्त इंजन 2.0" : "Dost Engine 2.0"}</span>
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
            ? "बिना signup flow में फँसे AIDost workspace खोलें और AI response देखें।"
            : "Open the AIDost workspace and check AI responses without getting stuck in signup."}
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

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-background/80 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-gradient-aurora" />
          <span className="font-display font-bold">AIDost</span>
          <span className="ml-3 text-xs text-muted-foreground">© 2026 · {t("footer.tag")}</span>
        </div>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
          <Link to="/login" className="hover:text-foreground">Login</Link>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Features />
      <ToolsGrid />
      <CTA />
      <Footer />
    </div>
  );
}
