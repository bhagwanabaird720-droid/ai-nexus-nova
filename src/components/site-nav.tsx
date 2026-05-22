import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";

import { useI18n, type Lang } from "@/lib/i18n";
import { useAuth, signOut } from "@/hooks/use-auth";

function LangToggle() {
  const { lang, setLang } = useI18n();
  const opts: Lang[] = ["en", "hi"];
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-surface/60 p-0.5 text-xs">
      {opts.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
            lang === l
              ? "bg-gradient-aurora text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={l === "en" ? "English" : "हिंदी"}
        >
          {l === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}

type NavLink = { to: string; label: string };

export function SiteNav() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links: NavLink[] = [
    { to: "/", label: lang === "hi" ? "होम" : "Home" },
    { to: "/chat", label: lang === "hi" ? "चैट" : "Chat" },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="AIDost home">
            <div className="size-8 rounded-lg bg-gradient-aurora glow-aurora" />
            <span className="font-display text-lg font-bold tracking-tight">AIDost</span>
          </Link>

          <div className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-3 py-1.5 transition-colors hover:bg-surface/60 hover:text-foreground"
                activeProps={{ className: "text-foreground bg-surface/60" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle />
            {user ? (
              <button
                onClick={() => signOut()}
                className="hidden rounded-full border border-border bg-surface/50 px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface sm:inline-flex"
              >
                {t("nav.logout")}
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full bg-gradient-aurora px-4 py-1.5 text-sm font-semibold text-primary-foreground glow-aurora sm:inline-flex"
              >
                {t("nav.login")}
              </Link>
            )}
            <button
              onClick={() => setOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface/50 text-foreground md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-[78%] max-w-sm flex-col border-l border-border bg-surface/95 p-6 shadow-2xl animate-fade-up">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-gradient-aurora glow-aurora" />
                <span className="font-display text-base font-bold">AIDost</span>
              </Link>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/40"
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base font-medium text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  activeProps={{ className: "bg-background/60 text-foreground" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="mt-auto pt-6">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                  className="w-full rounded-full border border-border bg-background/50 px-4 py-3 text-sm font-semibold"
                >
                  {t("nav.logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-full bg-gradient-aurora px-4 py-3 text-center text-sm font-semibold text-primary-foreground glow-aurora"
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
