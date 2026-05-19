import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t, lang } = useI18n();
  return (
    <footer className="border-t border-border bg-background/80 px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-gradient-aurora" />
            <span className="font-display font-bold">AIDost</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {lang === "hi"
              ? "भारत में बना आपका AI साथी।"
              : "Your AI bestie, built in Bharat."}
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            {lang === "hi" ? "उत्पाद" : "Product"}
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/chat" className="hover:text-foreground">{lang === "hi" ? "चैट" : "Chat"}</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">{lang === "hi" ? "डैशबोर्ड" : "Dashboard"}</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            {lang === "hi" ? "कंपनी" : "Company"}
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/settings" className="hover:text-foreground">Settings</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
            {lang === "hi" ? "कानूनी" : "Legal"}
          </p>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-border pt-6 text-center text-xs text-muted-foreground">
        © 2026 AIDost · {t("footer.tag")}
      </div>
    </footer>
  );
}
