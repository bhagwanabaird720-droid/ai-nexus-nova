import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AIVIO — Your AI Bestie for Bharat" },
      { name: "description", content: "AIVIO is a futuristic AI SaaS platform built for Hindi & English creators, students and professionals across India." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-6 py-20 text-foreground">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-3xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back home</Link>
        <h1 className="mt-6 font-display text-5xl font-bold">About <span className="text-gradient-aurora">AIVIO</span></h1>
        <p className="mt-6 text-lg text-muted-foreground">
          AIVIO (आपका AI दोस्त) is a futuristic AI workspace built for India. We combine the power of modern
          large language models with a fast, beautiful, Hindi-first interface so anyone can chat, create, study
          and ship — without friction.
        </p>
        <p className="mt-4 text-muted-foreground">
          Our mission is to make world-class AI accessible to every Bharatiya creator, student and small
          business. From homework help to professional resumes, every tool is tuned to feel natural in both
          Hindi and English.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { k: "13+", v: "AI tools" },
            { k: "2", v: "Languages" },
            { k: "∞", v: "Possibilities" },
          ].map((s) => (
            <div key={s.v} className="rounded-2xl border border-border bg-surface/60 p-6 text-center">
              <div className="font-display text-3xl font-bold text-gradient-aurora">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
