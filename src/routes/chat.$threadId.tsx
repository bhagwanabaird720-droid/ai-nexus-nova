import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { ArrowLeft, Send, Sparkles, Copy, RotateCcw, Plus, MessageSquare, Trash2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { runAiTool } from "@/lib/tool-runner.functions";

export const Route = createFileRoute("/chat/$threadId")({
  component: ChatThreadPage,
});

type Message = { id?: string; role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; updated_at: string };

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const { lang } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const runTool = useServerFn(runAiTool);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setLoadingMsgs(true);
    void (async () => {
      const [{ data: msgs }, { data: ths }] = await Promise.all([
        supabase
          .from("chat_messages")
          .select("id,role,content")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: true }),
        supabase
          .from("chat_threads")
          .select("id,title,updated_at")
          .order("updated_at", { ascending: false })
          .limit(30),
      ]);
      setMessages(
        (msgs ?? []).map((m) => ({ id: m.id, role: m.role as "user" | "assistant", content: m.content ?? "" })),
      );
      setThreads(ths ?? []);
      setLoadingMsgs(false);
    })();
  }, [threadId, user, authLoading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function send(text: string) {
    if (!user || !text.trim() || sending) return;
    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setSending(true);

    // Save user msg
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      thread_id: threadId,
      role: "user",
      content: text,
      parts: [],
    });

    try {
      const history = nextMessages.slice(-20).slice(0, -1).map((m) => ({ role: m.role, content: m.content }));
      const result = await runTool({ data: { toolId: "chat", input: text, history } });
      const assistant: Message = { role: "assistant", content: result.text };
      setMessages((prev) => [...prev, assistant]);
      await supabase.from("chat_messages").insert({
        user_id: user.id,
        thread_id: threadId,
        role: "assistant",
        content: result.text,
        parts: [],
      });
      // Auto-title from first user message
      if (messages.length === 0) {
        const title = text.slice(0, 60);
        await supabase.from("chat_threads").update({ title, updated_at: new Date().toISOString() }).eq("id", threadId);
      } else {
        await supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI error");
    } finally {
      setSending(false);
    }
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    await send(text);
  }

  async function newChat() {
    if (!user) return;
    const { data } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: lang === "hi" ? "नई चैट" : "New chat" })
      .select("id")
      .single();
    if (data) navigate({ to: "/chat/$threadId", params: { threadId: data.id } });
  }

  async function deleteThread() {
    if (!confirm(lang === "hi" ? "यह चैट हटाएँ?" : "Delete this chat?")) return;
    await supabase.from("chat_messages").delete().eq("thread_id", threadId);
    await supabase.from("chat_threads").delete().eq("id", threadId);
    navigate({ to: "/chat" });
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text);
    toast.success(lang === "hi" ? "कॉपी हो गया" : "Copied");
  }

  async function regenerateLast() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // Remove last assistant if present
    setMessages((prev) => {
      const lastIdx = prev.length - 1;
      if (lastIdx >= 0 && prev[lastIdx].role === "assistant") return prev.slice(0, lastIdx);
      return prev;
    });
    await send(lastUser.content);
  }

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-border bg-surface/40 p-4 lg:block">
          <Link to="/" className="mb-4 flex items-center gap-2">
            <ArrowLeft className="size-4" />
            <span className="text-xs text-muted-foreground">Home</span>
          </Link>
          <button
            onClick={newChat}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-aurora py-2.5 text-sm font-semibold text-primary-foreground glow-aurora"
          >
            <Plus className="size-4" /> {lang === "hi" ? "नई चैट" : "New chat"}
          </button>
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {lang === "hi" ? "पिछली बातचीत" : "Recent"}
          </p>
          <div className="space-y-1 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
            {threads.map((th) => (
              <Link
                key={th.id}
                to="/chat/$threadId"
                params={{ threadId: th.id }}
                className={`flex items-center gap-2 truncate rounded-lg px-3 py-2 text-sm ${
                  th.id === threadId ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-surface"
                }`}
              >
                <MessageSquare className="size-3.5 shrink-0" />
                <span className="truncate">{th.title || "New chat"}</span>
              </Link>
            ))}
          </div>
        </aside>

        {/* Main chat */}
        <section className="flex flex-1 flex-col p-4 sm:p-6">
          <header className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/chat" className="lg:hidden inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface/50">
                <ArrowLeft className="size-4" />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-widest text-accent">AIDost Chat</p>
                <h1 className="font-display text-xl font-bold">
                  {lang === "hi" ? "AI दोस्त" : "AI Bestie"}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
                <Sparkles className="size-3" /> Live
              </span>
              <button
                onClick={deleteThread}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface/50 hover:bg-surface"
                title="Delete chat"
              >
                <Trash2 className="size-4 text-muted-foreground" />
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="scrollbar-thin flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-background/35 p-4"
            style={{ maxHeight: "calc(100vh - 220px)" }}
          >
            {loadingMsgs ? (
              <p className="text-sm text-muted-foreground">{lang === "hi" ? "लोड हो रहा है…" : "Loading…"}</p>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-aurora glow-aurora">
                  <MessageSquare className="size-6 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold">
                  {lang === "hi" ? "AIDost से बात शुरू करें" : "Start chatting with AIDost"}
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {lang === "hi"
                    ? "हिंदी, अंग्रेज़ी या Hinglish — कुछ भी पूछें।"
                    : "Ask anything in Hindi, English or Hinglish."}
                </p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface/80 text-foreground"
                    }`}
                  >
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                    {m.role === "assistant" && (
                      <div className="mt-2 flex gap-3 text-[11px] text-muted-foreground">
                        <button onClick={() => copy(m.content)} className="inline-flex items-center gap-1 hover:text-foreground">
                          <Copy className="size-3" /> {lang === "hi" ? "कॉपी" : "Copy"}
                        </button>
                        {idx === messages.length - 1 && (
                          <button onClick={regenerateLast} className="inline-flex items-center gap-1 hover:text-foreground">
                            <RotateCcw className="size-3" /> {lang === "hi" ? "फिर बनाएँ" : "Regenerate"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {sending && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <span className="size-2 animate-pulse rounded-full bg-accent" />
                    AIDost {lang === "hi" ? "सोच रहा है…" : "is thinking…"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={submit} className="mt-3 flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }}
              placeholder={lang === "hi" ? "AIDost से कुछ भी पूछें…" : "Ask AIDost anything…"}
              rows={2}
              className="min-h-14 flex-1 resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              disabled={sending || !input.trim()}
              className="inline-flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-aurora text-primary-foreground glow-aurora disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="size-5" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
