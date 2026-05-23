import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AIVIO" },
      { name: "description", content: "How AIVIO collects, uses and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="aurora-bg absolute inset-0 opacity-50" />
      <article className="relative mx-auto max-w-3xl prose-aivio">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back home</Link>
        <h1 className="mt-6 font-display text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. What we collect</h2>
            <p>When you create an AIVIO account we store your email, optional name, and your chat history. AI prompts and responses are saved to your account so you can return to past conversations.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How we use your data</h2>
            <p>We use your data to provide the AIVIO services, improve quality, and prevent abuse. We do not sell your personal data. AI prompts are sent to model providers (e.g. Google Gemini) to generate responses.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Storage & security</h2>
            <p>Data is stored on secure cloud infrastructure with row-level security. Only you can read your own chats. You can delete all your data anytime from Settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Cookies</h2>
            <p>We use essential cookies for authentication and language preference. We do not use third-party tracking cookies by default.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Your rights</h2>
            <p>You can export, modify or delete your data at any time. Email us at hello@aivio.app for any data requests.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Children</h2>
            <p>AIVIO is not directed to children under 13. If you believe a child has given us data, contact us and we will delete it.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
