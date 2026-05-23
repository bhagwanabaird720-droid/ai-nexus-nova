import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — AIVIO" }, { name: "description", content: "Create your free AIVIO account." }] }),
  component: SignupPage,
});

function SignupPage() {
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
    const email = String(fd.get("email"));
    const password = String(fd.get("password"));
    const fullName = String(fd.get("name") || "");
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });

    if (error && /already|exists|registered/i.test(error.message)) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInErr) {
        toast.error("Yeh email pehle Google se signup hua tha. 'Continue with Google' use karein, ya alag email try karein.");
        return;
      }
      toast.success("Logged in!");
      navigate({ to: "/" });
      return;
    }

    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created!");
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
          <h1 className="font-display text-3xl font-bold">{t("auth.signup.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start free. कोई कार्ड नहीं चाहिए।</p>

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
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("auth.name")}</label>
              <input name="name" required className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("auth.email")}</label>
              <input name="email" type="email" required className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{t("auth.password")}</label>
              <input name="password" type="password" required minLength={6} className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none" />
            </div>
            <button disabled={loading} className="w-full rounded-full bg-gradient-aurora py-3 text-sm font-semibold text-primary-foreground glow-aurora disabled:opacity-60">
              {loading ? "…" : t("nav.signup")}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("auth.haveAccount")} <Link to="/login" className="text-accent hover:underline">{t("nav.login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
