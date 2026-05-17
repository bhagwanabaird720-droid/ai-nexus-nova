import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AIDost — Get in touch" },
      { name: "description", content: "Questions, feedback or partnerships? Reach the AIDost team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-6 py-20 text-foreground">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-2xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back home</Link>
        <h1 className="mt-6 font-display text-5xl font-bold">Get in <span className="text-gradient-aurora">touch</span></h1>
        <p className="mt-4 text-muted-foreground">हमें संदेश भेजें — हम 24 घंटे में जवाब देंगे।</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <Mail className="size-5 text-accent" />
            <div className="mt-3 text-sm font-medium">Email</div>
            <div className="text-xs text-muted-foreground">hello@aidost.app</div>
          </div>
          <div className="rounded-2xl border border-border bg-surface/60 p-5">
            <MessageCircle className="size-5 text-accent" />
            <div className="mt-3 text-sm font-medium">Support</div>
            <div className="text-xs text-muted-foreground">Mon–Sat, 10am – 7pm IST</div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSending(true);
            setTimeout(() => {
              setSending(false);
              toast.success("Message sent! We'll be in touch soon.");
              (e.target as HTMLFormElement).reset();
            }, 700);
          }}
          className="mt-8 space-y-4 rounded-3xl border border-border bg-surface/60 p-6"
        >
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</label>
            <input required className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input required type="email" className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea required rows={4} className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
          </div>
          <button
            disabled={sending}
            className="w-full rounded-full bg-gradient-aurora px-5 py-3 text-sm font-semibold text-primary-foreground glow-aurora disabled:opacity-60"
          >
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
