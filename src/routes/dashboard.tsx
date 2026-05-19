import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageSquare, Sparkles, LogOut, ArrowRight, Heart } from "lucide-react";

import { useAuth, signOut } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { TOOLS, ACCENT_CLASSES, getTool } from "@/lib/tools-catalog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AIDost" },
      { name: "description", content: "Your AIDost workspace: chats, favorites and usage." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [threadCount, setThreadCount] = useState<number | null>(null);
  const [msgCount, setMsgCount] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    void (async () => {
      const [{ count: tc }, { count: mc }] = await Promise.all([
        supabase.from("chat_threads").select("*", { count: "exact", head: true }),
        supabase.from("chat_messages").select("*", { count: "exact", head: true }),
      ]);
      setThreadCount(tc ?? 0);
      setMsgCount(mc ?? 0);
    })();
    setFavorites(JSON.parse(localStorage.getItem("aidost.favorites") || "[]"));
  }, [user, loading, navigate]);

  const favTools = favorites.map(getTool).filter((t): t is NonNullable<ReturnType<typeof getTool>> => Boolean(t));
  const popular = TOOLS.slice(0, 6);

  return (
    <main className="relative min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Home</Link>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/" }))}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/50 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" /> {lang === "hi" ? "लॉग आउट" : "Log out"}
          </button>
        </div>

        <div className="rounded-3xl border border-border bg-surface/60 p-8 backdrop-blur-md">
          <p className="text-xs uppercase tracking-widest text-accent">{lang === "hi" ? "स्वागत है" : "Welcome"}</p>
          <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
            {user?.email?.split("@")[0] || (lang === "hi" ? "दोस्त" : "Friend")} 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "hi"
              ? "आपका AI वर्कस्पेस यहाँ है। जहाँ छोड़ा था वहीं से शुरू करें।"
              : "Your AI workspace. Pick up where you left off."}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label={lang === "hi" ? "चैट थ्रेड्स" : "Chat threads"} value={threadCount} icon={MessageSquare} />
            <StatCard label={lang === "hi" ? "AI मैसेज" : "AI messages"} value={msgCount} icon={Sparkles} />
            <StatCard label={lang === "hi" ? "पसंदीदा" : "Favorites"} value={favTools.length} icon={Heart} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/chat" className="inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-aurora">
              <MessageSquare className="size-4" /> {lang === "hi" ? "चैट खोलें" : "Open chat"}
            </Link>
            <Link to="/" hash="tools" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm font-semibold hover:bg-surface">
              {lang === "hi" ? "सभी टूल्स" : "All tools"} <ArrowRight className="size-4" />
            </Link>
            <Link to="/settings" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm font-semibold hover:bg-surface">
              {lang === "hi" ? "सेटिंग्स" : "Settings"}
            </Link>
          </div>
        </div>

        {favTools.length > 0 && (
          <Section title={lang === "hi" ? "आपके पसंदीदा" : "Your favorites"}>
            <ToolList tools={favTools} />
          </Section>
        )}

        <Section title={lang === "hi" ? "लोकप्रिय टूल्स" : "Popular tools"}>
          <ToolList tools={popular} />
        </Section>
      </div>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number | null; icon: typeof MessageSquare }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value ?? "—"}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function ToolList({ tools }: { tools: ReturnType<typeof getTool>[] }) {
  const { lang } = useI18n();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => {
        if (!tool) return null;
        const a = ACCENT_CLASSES[tool.accent];
        const Icon = tool.icon;
        return (
          <Link
            key={tool.id}
            to="/tools/$toolId"
            params={{ toolId: tool.id }}
            className={`flex items-center gap-3 rounded-2xl border border-border bg-surface/60 p-4 transition-colors ${a.ring}`}
          >
            <div className={`flex size-10 items-center justify-center rounded-xl ${a.bg}`}>
              <Icon className={`size-4 ${a.text}`} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{lang === "hi" ? tool.name.hi : tool.name.en}</p>
              <p className="truncate text-xs text-muted-foreground">{lang === "hi" ? tool.tagline.hi : tool.tagline.en}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
