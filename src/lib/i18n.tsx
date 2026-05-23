import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, { en: string; hi: string }>;

const dict: Dict = {
  "nav.tools": { en: "Tools", hi: "उपकरण" },
  "nav.pricing": { en: "Pricing", hi: "मूल्य" },
  "nav.about": { en: "About", hi: "हमारे बारे में" },
  "nav.contact": { en: "Contact", hi: "संपर्क" },
  "nav.login": { en: "Log in", hi: "लॉगिन" },
  "nav.signup": { en: "Get Started", hi: "शुरू करें" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.settings": { en: "Settings", hi: "सेटिंग्स" },
  "nav.logout": { en: "Log out", hi: "लॉग आउट" },
  "hero.badge": { en: "Now live: AIVIO Engine 2.0", hi: "नया: AIVIO इंजन 2.0" },
  "hero.title.a": { en: "Your AI Bestie.", hi: "आपका AI साथी।" },
  "hero.title.b": { en: "आपका AI दोस्त।", hi: "Built in Bharat." },
  "hero.subtitle": {
    en: "13+ AI tools in one futuristic workspace — chat, write, study, design and ship faster. Powerful like ChatGPT, intuitive like Canva.",
    hi: "एक ही मंच पर 13+ AI उपकरण — बातचीत, लेखन, पढ़ाई और रचनात्मकता। ChatGPT जैसा शक्तिशाली, Canva जैसा सरल।",
  },
  "hero.cta.primary": { en: "Try AIVIO Free", hi: "मुफ़्त आज़माएँ" },
  "hero.cta.secondary": { en: "Open Dashboard", hi: "डैशबोर्ड देखें" },
  "tools.heading": { en: "AI Toolbox", hi: "AI टूलबॉक्स" },
  "tools.search": { en: "Search tools…", hi: "उपकरण खोजें…" },
  "tools.all": { en: "All", hi: "सभी" },
  "tools.launch": { en: "Launch", hi: "खोलें" },
  "footer.tag": { en: "Crafted with care in Bharat.", hi: "भारत में बनाया गया।" },
  "auth.login.title": { en: "Welcome back", hi: "वापसी पर स्वागत है" },
  "auth.signup.title": { en: "Create your account", hi: "खाता बनाएँ" },
  "auth.email": { en: "Email", hi: "ईमेल" },
  "auth.password": { en: "Password", hi: "पासवर्ड" },
  "auth.name": { en: "Full name", hi: "पूरा नाम" },
  "auth.continueGoogle": { en: "Continue with Google", hi: "Google से जारी रखें" },
  "auth.or": { en: "or", hi: "या" },
  "auth.haveAccount": { en: "Already have an account?", hi: "पहले से खाता है?" },
  "auth.noAccount": { en: "Don't have an account?", hi: "खाता नहीं है?" },
  "chat.placeholder": { en: "Ask AIVIO anything…", hi: "AIVIO से कुछ भी पूछें…" },
  "chat.new": { en: "New chat", hi: "नई चैट" },
  "chat.threads": { en: "Conversations", hi: "बातचीत" },
  "chat.empty": { en: "Start a conversation", hi: "बातचीत शुरू करें" },
  "chat.emptySub": {
    en: "Your AIVIO is ready in Hindi & English.",
    hi: "आपका AIVIO हिंदी और अंग्रेज़ी में तैयार है।",
  },
  "settings.title": { en: "Settings", hi: "सेटिंग्स" },
  "settings.profile": { en: "Profile", hi: "प्रोफ़ाइल" },
  "settings.language": { en: "Language", hi: "भाषा" },
  "settings.save": { en: "Save changes", hi: "सहेजें" },
};

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("aivio.lang") as Lang | null) ?? "en";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("aivio.lang", l);
  };

  const t = (key: string) => {
    const entry = (dict as Record<string, { en: string; hi: string }>)[key];
    if (!entry) return key;
    return entry[lang] ?? entry.en;
  };

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
