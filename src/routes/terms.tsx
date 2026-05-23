import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — AIVIO" },
      { name: "description", content: "The rules that govern your use of AIVIO." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="aurora-bg absolute inset-0 opacity-50" />
      <article className="relative mx-auto max-w-3xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back home</Link>
        <h1 className="mt-6 font-display text-4xl font-bold">Terms of Service</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: May 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance</h2>
            <p>By using AIVIO you agree to these terms. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Acceptable use</h2>
            <p>You agree not to use AIVIO to generate unlawful, harmful, hateful, sexually explicit, or infringing content; to spam others; or to attempt to reverse engineer the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. AI output</h2>
            <p>AI-generated content may be inaccurate. You are responsible for verifying outputs before using them for important decisions.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Account</h2>
            <p>You must provide accurate information when creating an account and keep your credentials secure.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Termination</h2>
            <p>We may suspend accounts that violate these terms. You may delete your account anytime from Settings.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Liability</h2>
            <p>AIVIO is provided “as is” without warranties. To the maximum extent allowed by law, we are not liable for any indirect damages arising from use of the service.</p>
          </section>
        </div>
      </article>
    </div>
  );
}
