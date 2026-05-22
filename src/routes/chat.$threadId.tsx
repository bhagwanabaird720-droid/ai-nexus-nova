import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import {
  ArrowLeft,
  Send,
  Sparkles,
  Copy,
  RotateCcw,
  Plus,
  MessageSquare,
  Trash2,
  Menu,
  X,
  Bot,
  User as UserIcon,
  PanelLeftClose,
} from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { runAiTool } from "@/lib/tool-runner.functions";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Chat — AIDost" },
      { name: "description", content: "Continue your AI conversation on AIDost." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatThreadPage,
});

type Message = { id?: string; role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; updated_at: string };

const SUGGESTIONS_EN = [
  { title: "Explain a tricky topic", subtitle: "in simple Hinglish" },
  { title: "Write a polite email", subtitle: "to my manager" },
  { title: "Plan my day", subtitle: "with focus blocks" },
  { title: "Translate Hindi → English", subtitle: "keep the tone natural" },
];
const SUGGESTIONS_HI = [
  { title: "कोई मुश्किल topic समझाओ", subtitle: "आसान Hinglish में" },
  { title: "Polite email लिखो", subtitle: "मेरे manager के लिए" },
  { title: "मेरा दिन plan करो", subtitle: "focus blocks के साथ" },
  { title: "Hindi → English अनुवाद", subtitle: "tone natural रखो" },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = useMemo(() => (lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN), [lang]);

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
          .not("title", "like", "__tool:%")
          .order("updated_at", { ascending: false })
          .limit(50),
      ]);
      setMessages(
        (msgs ?? []).map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content ?? "",
        })),
      );
      setThreads(ths ?? []);
      setLoadingMsgs(false);
    })();
  }, [threadId, user, authLoading, navigate]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, sending]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [input]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [threadId]);

  async function send(text: string) {
    if (!user || !text.trim() || sending) return;
    const userMsg: Message = { role: "user", content: text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setSending(true);

    await supabase.from("chat_messages").insert({
      user_id: user.id,
      thread_id: threadId,
      role: "user",
      content: text,
      parts: [],
    });

    try {
      const history = nextMessages
        .slice(-20)
        .slice(0, -1)
        .map((m) => ({ role: m.role, content: m.content }));
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
      if (messages.length === 0) {
        const title = text.slice(0, 60);
        await supabase
          .from("chat_threads")
          .update({ title, updated_at: new Date().toISOString() })
          .eq("id", threadId);
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, title } : t)),
        );
      } else {
        await supabase
          .from("chat_threads")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", threadId);
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
    setMessages((prev) => {
      const lastIdx = prev.length - 1;
      if (lastIdx >= 0 && prev[lastIdx].role === "assistant") return prev.slice(0, lastIdx);
      return prev;
    });
    await send(lastUser.content);
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-3 pt-3">
        <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" /> Home
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-md p-1.5 text-muted-foreground hover:bg-surface/80 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="p-3">
        <button
          onClick={newChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-aurora py-2.5 text-sm font-semibold text-primary-foreground glow-aurora transition-transform active:scale-[0.98]"
        >
          <Plus className="size-4" /> {lang === "hi" ? "नई चैट" : "New chat"}
        </button>
      </div>

      <p className="px-4 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {lang === "hi" ? "पिछली बातचीत" : "Recent chats"}
      </p>

      <div className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {threads.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            {lang === "hi" ? "कोई चैट नहीं" : "No chats yet"}
          </p>
        ) : (
          threads.map((th) => (
            <Link
              key={th.id}
              to="/chat/$threadId"
              params={{ threadId: th.id }}
              className={`group flex items-center gap-2 truncate rounded-lg px-3 py-2 text-sm transition-colors ${
                th.id === threadId
                  ? "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-surface/80 hover:text-foreground"
              }`}
            >
              <MessageSquare className="size-3.5 shrink-0 opacity-70" />
              <span className="truncate">{th.title || (lang === "hi" ? "नई चैट" : "New chat")}</span>
            </Link>
          ))
        )}
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2 rounded-lg bg-surface/60 px-3 py-2 text-xs text-muted-foreground">
          <div className="flex size-7 items-center justify-center rounded-full bg-gradient-aurora text-[10px] font-bold text-primary-foreground">
            {(user?.email?.[0] ?? "A").toUpperCase()}
          </div>
          <span className="truncate">{user?.email ?? "AIDost"}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="relative flex h-[100dvh] overflow-hidden bg-background text-foreground">
      <div className="aurora-bg pointer-events-none absolute inset-0 opacity-60" />

      {/* Desktop sidebar */}
      <aside className="relative z-10 hidden w-72 shrink-0 border-r border-border bg-surface/40 backdrop-blur-md lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs animate-fade-up border-r border-border bg-background/95 backdrop-blur-xl lg:hidden">
            {SidebarContent}
          </aside>
        </>
      )}

      {/* Main chat column */}
      <section className="relative z-10 flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-3 border-b border-border/60 bg-background/60 px-3 py-3 backdrop-blur-md sm:px-5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface/50 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-aurora glow-aurora">
                <Sparkles className="size-4 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <h1 className="font-display text-sm font-bold sm:text-base">
                  {lang === "hi" ? "AI दोस्त" : "AI Bestie"}
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-accent">AIDost Chat</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={newChat}
              className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface/50 px-3 py-1.5 text-xs font-medium hover:bg-surface sm:inline-flex"
            >
              <Plus className="size-3.5" /> {lang === "hi" ? "नई" : "New"}
            </button>
            <button
              onClick={deleteThread}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted-foreground hover:bg-surface hover:text-destructive"
              title={lang === "hi" ? "चैट हटाएँ" : "Delete chat"}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6">
            {loadingMsgs ? (
              <div className="space-y-4">
                <div className="h-16 animate-pulse rounded-2xl bg-surface/50" />
                <div className="h-24 animate-pulse rounded-2xl bg-surface/50" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-aurora glow-aurora">
                  <Sparkles className="size-7 text-primary-foreground" />
                </div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">
                  {lang === "hi" ? "आज क्या बनाएँ?" : "What shall we build today?"}
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  {lang === "hi"
                    ? "हिंदी, अंग्रेज़ी या Hinglish — कुछ भी पूछें।"
                    : "Ask in Hindi, English, or Hinglish. AIDost has your back."}
                </p>

                <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {suggestions.map((s) => (
                    <button
                      key={s.title}
                      onClick={() => send(`${s.title} — ${s.subtitle}`)}
                      className="group rounded-xl border border-border bg-surface/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface/70"
                    >
                      <p className="text-sm font-semibold text-foreground">{s.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((m, idx) => (
                  <MessageRow
                    key={idx}
                    message={m}
                    isLast={idx === messages.length - 1}
                    onCopy={() => copy(m.content)}
                    onRegenerate={regenerateLast}
                    lang={lang}
                    userEmail={user?.email ?? ""}
                  />
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <Avatar role="assistant" userEmail="" />
                    <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-surface/60 px-4 py-3">
                      <span className="size-1.5 animate-bounce rounded-full bg-accent" />
                      <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-accent [animation-delay:0.3s]" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border/60 bg-background/80 px-3 pb-4 pt-3 backdrop-blur-md sm:px-6">
          <form onSubmit={submit} className="mx-auto w-full max-w-3xl">
            <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-surface/60 p-2 shadow-lg focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void submit(e as unknown as React.FormEvent<HTMLFormElement>);
                  }
                }}
                placeholder={
                  lang === "hi" ? "AIDost से कुछ भी पूछें…" : "Message AIDost…"
                }
                rows={1}
                className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                disabled={sending || !input.trim()}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-aurora text-primary-foreground glow-aurora transition-transform active:scale-95 disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              {lang === "hi"
                ? "AIDost गलतियाँ कर सकता है। ज़रूरी जानकारी verify करें।"
                : "AIDost can make mistakes. Verify important info."}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

function Avatar({ role, userEmail }: { role: "user" | "assistant"; userEmail: string }) {
  if (role === "assistant") {
    return (
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-aurora text-primary-foreground glow-aurora">
        <Bot className="size-4" />
      </div>
    );
  }
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-xs font-bold text-foreground">
      {userEmail ? userEmail[0].toUpperCase() : <UserIcon className="size-4" />}
    </div>
  );
}

function MessageRow({
  message,
  isLast,
  onCopy,
  onRegenerate,
  lang,
  userEmail,
}: {
  message: Message;
  isLast: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  lang: "hi" | "en";
  userEmail: string;
}) {
  const isUser = message.role === "user";
  return (
    <div className="flex gap-3">
      <Avatar role={message.role} userEmail={userEmail} />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-semibold text-muted-foreground">
          {isUser ? (lang === "hi" ? "आप" : "You") : "AIDost"}
        </p>
        <div
          className={`prose prose-invert prose-sm max-w-none rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "border border-primary/30 bg-primary/10 text-foreground"
              : "border border-border bg-surface/60 text-foreground"
          }`}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
        {!isUser && (
          <div className="mt-1.5 flex gap-3 text-[11px] text-muted-foreground">
            <button onClick={onCopy} className="inline-flex items-center gap-1 hover:text-foreground">
              <Copy className="size-3" /> {lang === "hi" ? "कॉपी" : "Copy"}
            </button>
            {isLast && (
              <button onClick={onRegenerate} className="inline-flex items-center gap-1 hover:text-foreground">
                <RotateCcw className="size-3" /> {lang === "hi" ? "फिर बनाएँ" : "Regenerate"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
