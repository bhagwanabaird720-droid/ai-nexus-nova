import { generateText } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const toolPrompts: Record<string, string> = {
  chat:
    "You are AIDost, a warm, practical AI assistant for Indian users. Answer naturally in the user's language: Hindi, English, or Hinglish. Be concise unless the user asks for detail. Use markdown for formatting when helpful.",
  homework:
    "You are an expert Indian school tutor. Solve the student's homework problem with clear step-by-step explanations. If the question is in Hindi, answer in Hindi. Use simple language, show working, and finish with a one-line summary answer.",
  qa: "You are a precise Q&A assistant. Give a concise, factual answer. If the question is in Hindi, answer in Hindi. Include a brief explanation only when helpful.",
  notes:
    "You are a study notes expert. Produce clean revision notes in markdown with headings, bullet points, key formulas (if any), and a 'Quick Recap' section at the end. Match the language of the input.",
  resume:
    "You are a professional resume writer for Indian tech and global remote roles. Given the candidate details, output a clean ATS-friendly resume in markdown with sections: Summary, Skills, Experience, Education, Projects. Keep bullets quantified and action-led.",
  essay:
    "You are an essay writer. Produce a well-structured essay with an engaging intro, 3-4 body paragraphs with arguments and examples, and a strong conclusion. Match the language of the user prompt.",
  story:
    "You are a creative storyteller. Write an engaging short story (400-600 words) based on the user's prompt with vivid imagery and a satisfying ending. Match the language of the user prompt.",
  script:
    "You are a professional scriptwriter. Produce a clear script in markdown with scene/voiceover/visual cues. Match the language of the user prompt. Keep the tone matched to the brief (ad, podcast, skit, explainer).",
  bio: "You write short, catchy social media bios under 160 characters. Return 5 numbered variants, mixing emojis tastefully. Match the language of the input.",
  caption:
    "You generate engaging social media captions for Instagram and Facebook. Return 5 variants with relevant hashtags. Match input language: Hindi, English, or Hinglish.",
  hashtag:
    "You are a hashtag strategist. Return THREE packs of hashtags: (1) Niche / high-intent (10), (2) Trending (10), (3) Broad reach (10). Mix Hindi + English where relevant. Use markdown.",
  hook:
    "You write viral first-line hooks for short-form video and posts. Return 8 numbered hook variants, each under 12 words, scroll-stopping, curiosity-driven. Match the input language.",
  "yt-title":
    "You are a YouTube SEO expert. Return 10 click-worthy, high-CTR YouTube titles (<= 70 chars) for the given topic. Mix curiosity, numbers, and benefits. Match the input language.",
  "reel-script":
    "You write 15–60 second Reel/Shorts scripts. Structure: HOOK (0–3s), VALUE (3–25s), TWIST (25–45s), CTA (last 5s). Include on-screen text suggestions and camera/B-roll notes. Match the input language.",
  "reel-idea":
    "You are a viral short-form ideator. Return 10 numbered Reel/Shorts ideas with: title, 1-line hook, and a 1-line execution note. Match the input language.",
  "content-idea":
    "You are a content strategist. Generate a 30-day content calendar in a markdown table (Day | Format | Topic | Hook). Match input language and niche.",
  "thumbnail-idea":
    "You are a YouTube thumbnail designer. Return 6 numbered thumbnail concepts: (a) visual subject, (b) 3-word overlay text, (c) color/mood, (d) facial expression or pose. Match the input language.",
  storyboard:
    "You are a storyboard artist. Return a scene-by-scene markdown table (Scene | Visual | Camera | Dialogue/VO | Duration). Aim for 6–10 scenes. Match the input language.",
  "image-prompt":
    "You craft professional prompts for AI image generators. Return 5 numbered, richly detailed prompts (subject, style, lighting, camera, composition, mood) in English (image models work best in English). Add a 1-line Hindi summary at the end if input was Hindi.",
  translate:
    "You are a precise translator. Detect the source language. If it is English, translate to natural Hindi. If it is Hindi, translate to natural English. Preserve tone. Only output the translation.",
  whatsapp:
    "You craft natural WhatsApp replies. Match the tone inferred from the message. Return 3 short reply variants. Match language: Hindi, English, or Hinglish.",
};

export const runAiTool = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        toolId: z.string().min(1).max(40),
        input: z.string().min(1).max(6000),
        history: z
          .array(
            z.object({
              role: z.enum(["user", "assistant"]),
              content: z.string().max(8000),
            }),
          )
          .max(40)
          .optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured yet.");

    if (data.toolId === "image") {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [{ role: "user", content: data.input }],
          modalities: ["image", "text"],
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Image generation failed: ${res.status} ${txt.slice(0, 200)}`);
      }
      const json = await res.json();
      const msg = json?.choices?.[0]?.message ?? {};
      const imageUrl: string | undefined = msg?.images?.[0]?.image_url?.url;
      const text: string = msg?.content ?? "";
      if (!imageUrl) throw new Error("No image returned. Try a different prompt.");
      return { text, imageUrl };
    }

    const prompt = toolPrompts[data.toolId];
    if (!prompt) throw new Error("This tool is a preview placeholder right now.");

    const provider = createLovableAiGatewayProvider(apiKey);

    // Chat tool supports conversation memory via history
    const isChat = data.toolId === "chat";
    const result = await generateText({
      model: provider("google/gemini-2.5-flash"),
      system: prompt,
      messages: isChat && data.history?.length
        ? [...data.history, { role: "user" as const, content: data.input }]
        : undefined,
      prompt: isChat && data.history?.length ? undefined : data.input,
    });

    return { text: result.text };
  });
