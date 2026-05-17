import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { useI18n } from "@/lib/i18n";
import { runAiTool } from "@/lib/tool-runner.functions";
import { getTool } from "@/lib/tools-catalog";

export const Route = createFileRoute("/tools/$toolId")({
  component: ToolPage,
});

type Message = { role: "user" | "assistant"; content: string };

function ToolPage() {
  const { toolId } = Route.useParams();
  const { lang, t } = useI18n();
  const tool = useMemo(() => getTool(toolId), [toolId]);
  const runTool = useServerFn(runAiTool);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  if (!tool) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold">Tool not found</h1>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-primary-foreground">
            Back home
          </Link>
        </div>
      </main>
    );
  }

  const title = lang === "hi" ? tool.name.hi : tool.name.en;
  const placeholder = lang === "hi" ? tool.inputPlaceholder?.hi : tool.inputPlaceholder?.en;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || !tool) return;
    if (tool.kind === "placeholder") {
      toast.info(lang === "hi" ? "यह सेक्शन अभी UI placeholder है।" : "This section is a UI placeholder for now.");
      return;
    }

    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    try {
      const result = await runTool({ data: { toolId: tool.id, input: text } });
      setMessages((prev) => [...prev, { role: "assistant", content: result.text }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI tool failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="aurora-bg absolute inset-0" />
      <div className="grid-overlay absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] max-w-6xl flex-col rounded-3xl border border-border bg-surface/60 backdrop-blur-xl">
        <header className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <Link to="/" className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background/50 hover:bg-surface">
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <p className="text-xs uppercase tracking-widest text-accent">AIDost Tool</p>
              <h1 className="font-display text-2xl font-bold">{title}</h1>
            </div>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs text-accent">
            <Sparkles className="size-3.5" /> {tool.kind === "placeholder" ? "Preview UI" : "Live AI"}
          </span>
        </header>

        <section className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-background/35 p-4">
            {messages.length === 0 ? (
              <div className="flex min-h-[52vh] flex-col items-center justify-center text-center">
                <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-aurora glow-aurora">
                  <tool.icon className="size-7 text-primary-foreground" />
                </div>
                <h2 className="font-display text-3xl font-bold">{title}</h2>
                <p className="mt-3 max-w-xl text-sm text-muted-foreground">
                  {tool.kind === "placeholder"
                    ? lang === "hi"
                      ? "यह AI media feature अभी placeholder है, layout testing के लिए तैयार है।"
                      : "This AI media feature is a placeholder, ready for layout testing."
                    : lang === "hi"
                      ? tool.tagline.hi
                      : tool.tagline.en}
                </p>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div key={idx} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface/80 text-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))
            )}
            {loading && <div className="text-sm text-muted-foreground">AIDost सोच रहा है…</div>}
          </div>

          <form onSubmit={submit} className="mt-4 flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder || t("chat.placeholder")}
              rows={2}
              className="min-h-14 flex-1 resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
            <button
              disabled={loading || !input.trim()}
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