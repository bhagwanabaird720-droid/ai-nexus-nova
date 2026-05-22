import { Link } from "@tanstack/react-router";
import { Github, Twitter, Instagram, Mail } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t, lang } = useI18n();

  const sections = [
    {
      title: lang === "hi" ? "उत्पाद" : "Product",
      links: [
        { to: "/", label: lang === "hi" ? "होम" : "Home" },
        { to: "/chat", label: lang === "hi" ? "चैट" : "Chat" },
        { to: "/dashboard", label: lang === "hi" ? "डैशबोर्ड" : "Dashboard" },
        { to: "/settings", label: lang === "hi" ? "सेटिंग्स" : "Settings" },
      ],
    },
    {
      title: lang === "hi" ? "कंपनी" : "Company",
      links: [
        { to: "/about", label: lang === "hi" ? "हमारे बारे में" : "About" },
        { to: "/contact", label: lang === "hi" ? "संपर्क" : "Contact" },
      ],
    },
    {
      title: lang === "hi" ? "कानूनी" : "Legal",
      links: [
        { to: "/privacy", label: lang === "hi" ? "गोपनीयता" : "Privacy Policy" },
        { to: "/terms", label: lang === "hi" ? "शर्तें" : "Terms of Service" },
      ],
    },
  ];

  const socials = [
    { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://github.com", icon: Github, label: "GitHub" },
    { href: "mailto:hello@aidost.app", icon: Mail, label: "Email" },
  ];

  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div className="aurora-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-gradient-aurora glow-aurora" />
              <span className="font-display text-lg font-bold tracking-tight">AIDost</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {lang === "hi"
                ? "13+ AI टूल्स, एक ही futuristic workspace में। भारत में बनाया गया आपका AI साथी।"
                : "13+ AI tools in one futuristic workspace. Your AI bestie, built in Bharat."}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface/50 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
            {sections.map((sec) => (
              <div key={sec.title}>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-foreground/90">
                  {sec.title}
                </p>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {sec.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} AIDost. {t("footer.tag")}</p>
          <p className="opacity-80">{lang === "hi" ? "भारत में बनाया गया" : "Made in Bharat"} ✦</p>
        </div>
      </div>
    </footer>
  );
}
