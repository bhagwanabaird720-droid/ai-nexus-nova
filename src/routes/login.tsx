import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — AIVIO" }, { name: "description", content: "Log in to AIVIO." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/" });
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error("Google sign-in failed");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Back</Link>
        <div className="mt-6 rounded-3xl border border-border bg-surface/70 p-8 backdrop-blur-md">
          <h1 className="font-display text-3xl font-bold">{t("auth.login.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">वापसी पर स्वागत है।</p>

          <button
            onClick={onGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/60 py-2.5 text-sm font-medium hover:bg-surface"
          >
            {t("auth.continueGoogle")}
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            {t("auth.or")}
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("auth.email")}</label>
              <input name="email" type="email" required className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("auth.password")}</label>
              <input name="password" type="password" required minLength={6} className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <button disabled={loading} className="w-full rounded-full bg-gradient-aurora py-3 text-sm font-semibold text-primary-foreground glow-aurora disabled:opacity-60">
              {loading ? "…" : t("auth.login.title")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("auth.noAccount")} <button type="button" onClick={onGoogle} className="text-accent hover:underline">{t("auth.continueGoogle")}</button>
          </p>
        </div>
      </div>
    </div>
  );
}
