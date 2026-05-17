import {
  MessageSquare,
  GraduationCap,
  HelpCircle,
  FileText,
  PenLine,
  BookOpen,
  UserCircle2,
  Hash,
  Languages,
  MessageCircle,
  ImageIcon,
  Video,
  Mic,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory = "chat" | "study" | "writing" | "social" | "media";

export type Tool = {
  id: string;
  name: { en: string; hi: string };
  tagline: { en: string; hi: string };
  category: ToolCategory;
  icon: LucideIcon;
  accent: "primary" | "accent" | "pink" | "amber" | "violet";
  /** AI system prompt that powers this tool. Empty = placeholder (image/video/audio). */
  systemPrompt?: string;
  /** Type of run UI. */
  kind: "chat" | "single" | "placeholder";
  inputLabel?: { en: string; hi: string };
  inputPlaceholder?: { en: string; hi: string };
  badge?: { en: string; hi: string };
};

export const TOOL_CATEGORIES: { id: "all" | ToolCategory; en: string; hi: string }[] = [
  { id: "all", en: "All", hi: "सभी" },
  { id: "chat", en: "Chat", hi: "बातचीत" },
  { id: "study", en: "Study", hi: "अध्ययन" },
  { id: "writing", en: "Writing", hi: "लेखन" },
  { id: "social", en: "Social", hi: "सोशल" },
  { id: "media", en: "Media", hi: "मीडिया" },
];

export const TOOLS: Tool[] = [
  {
    id: "chat",
    name: { en: "AI Chat Assistant", hi: "AI चैट सहायक" },
    tagline: { en: "Conversational AI for everyday questions.", hi: "रोज़मर्रा के सवालों के लिए AI साथी।" },
    category: "chat",
    icon: MessageSquare,
    accent: "primary",
    kind: "chat",
    badge: { en: "Popular", hi: "लोकप्रिय" },
  },
  {
    id: "homework",
    name: { en: "Homework Solver", hi: "होमवर्क हल" },
    tagline: { en: "Step-by-step answers for any subject.", hi: "हर विषय के लिए चरण-दर-चरण उत्तर।" },
    category: "study",
    icon: GraduationCap,
    accent: "accent",
    kind: "single",
    systemPrompt:
      "You are an expert Indian school tutor. Solve the student's homework problem with clear step-by-step explanations. If the question is in Hindi, answer in Hindi. Use simple language, show working, and finish with a one-line summary answer.",
    inputLabel: { en: "Paste your question", hi: "अपना सवाल लिखें" },
    inputPlaceholder: {
      en: "e.g. Solve: 2x + 5 = 13, then explain.",
      hi: "उदा. हल करें: 2x + 5 = 13, और समझाएँ।",
    },
  },
  {
    id: "qa",
    name: { en: "Question & Answer AI", hi: "प्रश्न-उत्तर AI" },
    tagline: { en: "Accurate answers from world knowledge.", hi: "विश्व ज्ञान से सटीक उत्तर।" },
    category: "study",
    icon: HelpCircle,
    accent: "violet",
    kind: "single",
    systemPrompt:
      "You are a precise Q&A assistant. Give a concise, factual answer. If the question is in Hindi, answer in Hindi. Include a brief explanation only when helpful.",
    inputPlaceholder: { en: "Ask anything…", hi: "कुछ भी पूछें…" },
  },
  {
    id: "resume",
    name: { en: "Resume Generator", hi: "रिज़्यूम जनरेटर" },
    tagline: { en: "ATS-friendly resumes in seconds.", hi: "ATS के लिए तैयार रिज़्यूम।" },
    category: "writing",
    icon: FileText,
    accent: "accent",
    kind: "single",
    systemPrompt:
      "You are a professional resume writer for Indian tech and global remote roles. Given the candidate details, output a clean ATS-friendly resume in markdown with sections: Summary, Skills, Experience, Education, Projects. Keep bullets quantified and action-led.",
    inputLabel: { en: "Tell us about yourself", hi: "अपने बारे में बताएँ" },
    inputPlaceholder: {
      en: "Name, role, years of experience, key skills, recent projects…",
      hi: "नाम, भूमिका, अनुभव, कौशल, हाल के प्रोजेक्ट…",
    },
  },
  {
    id: "essay",
    name: { en: "Essay Writer", hi: "निबंध लेखक" },
    tagline: { en: "Long-form essays with structure.", hi: "सुव्यवस्थित निबंध।" },
    category: "writing",
    icon: PenLine,
    accent: "pink",
    kind: "single",
    systemPrompt:
      "You are an essay writer. Produce a well-structured essay with an engaging intro, 3-4 body paragraphs with arguments and examples, and a strong conclusion. Match the language (Hindi/English) of the user prompt.",
    inputPlaceholder: { en: "Essay topic…", hi: "निबंध का विषय…" },
  },
  {
    id: "story",
    name: { en: "Story Generator", hi: "कहानी जनरेटर" },
    tagline: { en: "Imaginative short stories.", hi: "रचनात्मक लघु कथाएँ।" },
    category: "writing",
    icon: BookOpen,
    accent: "violet",
    kind: "single",
    systemPrompt:
      "You are a creative storyteller. Write an engaging short story (400-600 words) based on the user's prompt with vivid imagery and a satisfying ending. Match the language of the user prompt.",
    inputPlaceholder: { en: "Story premise…", hi: "कहानी का आरंभ…" },
  },
  {
    id: "bio",
    name: { en: "Bio Generator", hi: "बायो जनरेटर" },
    tagline: { en: "Crisp social profile bios.", hi: "शानदार सोशल बायो।" },
    category: "social",
    icon: UserCircle2,
    accent: "amber",
    kind: "single",
    systemPrompt:
      "You write short, catchy social media bios (under 160 chars). Return 5 numbered variants, mixing emojis tastefully. Match the language of the input.",
    inputPlaceholder: { en: "About me / niche…", hi: "मेरे बारे में…" },
  },
  {
    id: "caption",
    name: { en: "Caption Generator", hi: "कैप्शन जनरेटर" },
    tagline: { en: "Captions for Instagram & Facebook.", hi: "इंस्टा/फेसबुक कैप्शन।" },
    category: "social",
    icon: Hash,
    accent: "pink",
    kind: "single",
    systemPrompt:
      "You generate engaging social media captions for Instagram and Facebook. Return 5 variants with relevant hashtags. Match input language (Hindi/English/Hinglish).",
    inputPlaceholder: { en: "Describe your post…", hi: "अपनी पोस्ट बताएँ…" },
  },
  {
    id: "translate",
    name: { en: "Translation Tool", hi: "अनुवाद उपकरण" },
    tagline: { en: "Hindi ↔ English (and more).", hi: "हिंदी ↔ अंग्रेज़ी।" },
    category: "writing",
    icon: Languages,
    accent: "accent",
    kind: "single",
    systemPrompt:
      "You are a precise translator. Detect the source language. If it's English, translate to natural Hindi. If it's Hindi, translate to natural English. Preserve tone. Only output the translation.",
    inputPlaceholder: { en: "Text to translate…", hi: "अनुवाद हेतु पाठ…" },
  },
  {
    id: "whatsapp",
    name: { en: "WhatsApp Reply", hi: "WhatsApp जवाब" },
    tagline: { en: "Smart replies in your voice.", hi: "स्मार्ट जवाब।" },
    category: "social",
    icon: MessageCircle,
    accent: "accent",
    kind: "single",
    systemPrompt:
      "You craft natural WhatsApp replies. Match the tone (casual/formal/funny) inferred from the message. Return 3 short reply variants. Match language (Hindi/English/Hinglish).",
    inputLabel: { en: "Paste the message", hi: "संदेश पेस्ट करें" },
    inputPlaceholder: { en: "What did they say?", hi: "उन्होंने क्या लिखा?" },
  },
  {
    id: "image",
    name: { en: "AI Image Generator", hi: "AI चित्र जनरेटर" },
    tagline: { en: "Text-to-image studio.", hi: "टेक्स्ट से चित्र।" },
    category: "media",
    icon: ImageIcon,
    accent: "violet",
    kind: "placeholder",
    badge: { en: "Coming soon", hi: "जल्द आ रहा है" },
  },
  {
    id: "video",
    name: { en: "AI Video Generator", hi: "AI वीडियो जनरेटर" },
    tagline: { en: "Generate short clips from prompts.", hi: "प्रॉम्प्ट से वीडियो।" },
    category: "media",
    icon: Video,
    accent: "pink",
    kind: "placeholder",
    badge: { en: "Coming soon", hi: "जल्द आ रहा है" },
  },
  {
    id: "audio",
    name: { en: "AI Voice & Audio", hi: "AI आवाज़ व ऑडियो" },
    tagline: { en: "Synthesize natural voices.", hi: "प्राकृतिक आवाज़।" },
    category: "media",
    icon: Mic,
    accent: "amber",
    kind: "placeholder",
    badge: { en: "Coming soon", hi: "जल्द आ रहा है" },
  },
];

export function getTool(id: string) {
  return TOOLS.find((t) => t.id === id);
}

export const ACCENT_CLASSES: Record<Tool["accent"], { bg: string; text: string; ring: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary", ring: "hover:border-primary/40" },
  accent: { bg: "bg-accent/10", text: "text-accent", ring: "hover:border-accent/40" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", ring: "hover:border-pink-500/40" },
  amber: { bg: "bg-amber-400/10", text: "text-amber-400", ring: "hover:border-amber-400/40" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", ring: "hover:border-violet-500/40" },
};
