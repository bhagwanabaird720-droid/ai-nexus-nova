import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, User as UserIcon, Languages, Trash2 } from "lucide-react";

import { useAuth, signOut } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AIDost" },
      { name: "description", content: "Manage your AIDost profile, language, and account." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { lang, setLang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    void (async () => {
      const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      if (data?.full_name) setName(data.full_name);
    })();
  }, [user, loading, navigate]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(lang === "hi" ? "सेव हो गया" : "Saved");
  }

  async function clearAllChats() {
    if (!confirm(lang === "hi" ? "क्या आप पक्का सब चैट हटाना चाहते हैं?" : "Delete all chats?")) return;
    await supabase.from("chat_messages").delete().not("id", "is", null);
    await supabase.from("chat_threads").delete().not("id", "is", null);
    toast.success(lang === "hi" ? "सब हटा दिया गया" : "All chats deleted");
  }

  return (
    <main className="relative min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="aurora-bg absolute inset-0" />
      <div className="relative mx-auto max-w-2xl">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Home</Link>
        <h1 className="mt-4 font-display text-3xl font-bold">{lang === "hi" ? "सेटिंग्स" : "Settings"}</h1>

        <div className="mt-6 space-y-6">
          {/* Profile */}
          <form onSubmit={save} className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <UserIcon className="size-4 text-accent" />
              {lang === "hi" ? "प्रोफ़ाइल" : "Profile"}
            </div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              value={user?.email ?? ""}
              disabled
              className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-muted-foreground"
            />
            <label className="mt-4 mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {lang === "hi" ? "पूरा नाम" : "Full name"}
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
              placeholder={lang === "hi" ? "आपका नाम" : "Your name"}
            />
            <button
              disabled={saving}
              className="mt-4 rounded-full bg-gradient-aurora px-5 py-2 text-sm font-semibold text-primary-foreground glow-aurora disabled:opacity-60"
            >
              {saving ? "…" : lang === "hi" ? "सहेजें" : "Save changes"}
            </button>
          </form>

          {/* Language */}
          <div className="rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Languages className="size-4 text-accent" />
              {lang === "hi" ? "भाषा" : "Language"}
            </div>
            <div className="flex gap-2">
              {(["en", "hi"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                    lang === l
                      ? "border-primary bg-primary/20 text-foreground"
                      : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l === "en" ? "English" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
              <Trash2 className="size-4" />
              {lang === "hi" ? "डेंजर ज़ोन" : "Danger zone"}
            </div>
            <button
              onClick={clearAllChats}
              className="rounded-full border border-destructive/50 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
            >
              {lang === "hi" ? "सारी चैट हटाएँ" : "Delete all chats"}
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut().then(() => navigate({ to: "/" }))}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-5 py-2.5 text-sm font-semibold hover:bg-surface"
          >
            <LogOut className="size-4" /> {lang === "hi" ? "लॉग आउट" : "Log out"}
          </button>
        </div>
      </div>
    </main>
  );
}
