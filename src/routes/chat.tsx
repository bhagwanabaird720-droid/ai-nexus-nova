import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, MessageSquare, LogOut, Loader2 } from "lucide-react";

import { useAuth, signOut } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Workspace — AIDost" },
      { name: "description", content: "Threaded AI chat with cloud-saved history. Hindi, English & Hinglish — start a new conversation in seconds." },
      { property: "og:title", content: "AI Chat Workspace — AIDost" },
      { property: "og:description", content: "Threaded AI chat with cloud-saved history in Hindi & English." },
      { property: "og:url", content: "https://aidost.lovable.app/chat" },
    ],
    links: [{ rel: "canonical", href: "https://aidost.lovable.app/chat" }],
  }),
  component: ChatIndex,
});

type Thread = { id: string; title: string; updated_at: string };

function ChatIndex() {
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<Thread[] | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    void (async () => {
      const { data } = await supabase
        .from("chat_threads")
        .select("id,title,updated_at")
        .not("title", "like", "__tool:%")
        .order("updated_at", { ascending: false })
        .limit(50);
      setThreads(data ?? []);
    })();
  }, [user, loading, navigate]);

  async function newChat() {
    if (!user || creating) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: lang === "hi" ? "नई चैट" : "New chat" })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) return;
    navigate({ to: "/chat/$threadId", params: { threadId: data.id } });
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Home</Link>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/" }))}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-3.5" /> {lang === "hi" ? "लॉग आउट" : "Log out"}
          </button>
        </div>
        <div className="rounded-3xl border border-border bg-surface/60 p-6 backdrop-blur-md">
          <h1 className="font-display text-3xl font-bold">
            {lang === "hi" ? "आपकी बातचीत" : "Your conversations"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "hi"
              ? "क्लाउड में सुरक्षित आपकी पुरानी चैट्स।"
              : "Your previous chats, safely saved in the cloud."}
          </p>
          <button
            onClick={newChat}
            disabled={creating}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-aurora px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-aurora disabled:opacity-60"
          >
            {creating ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            {lang === "hi" ? "नई चैट शुरू करें" : "Start new chat"}
          </button>

          <div className="mt-8 space-y-2">
            {threads === null ? (
              <p className="text-sm text-muted-foreground">{lang === "hi" ? "लोड हो रहा है…" : "Loading…"}</p>
            ) : threads.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {lang === "hi" ? "अभी कोई चैट नहीं।" : "No chats yet."}
              </p>
            ) : (
              threads.map((th) => (
                <Link
                  key={th.id}
                  to="/chat/$threadId"
                  params={{ threadId: th.id }}
                  className="flex items-center justify-between rounded-xl border border-border bg-background/40 px-4 py-3 text-sm hover:border-primary/40"
                >
                  <span className="flex items-center gap-3 truncate">
                    <MessageSquare className="size-4 shrink-0 text-accent" />
                    <span className="truncate">{th.title || "New chat"}</span>
                  </span>
                  <span className="ml-3 shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {new Date(th.updated_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
