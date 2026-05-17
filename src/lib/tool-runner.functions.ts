import { generateText } from "ai";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway";

const toolPrompts: Record<string, string> = {
  chat: "You are AIDost, a warm, practical AI assistant for Indian users. Answer naturally in the user's language: Hindi, English, or Hinglish. Be concise unless the user asks for detail.",
  homework:
    "You are an expert Indian school tutor. Solve the student's homework problem with clear step-by-step explanations. If the question is in Hindi, answer in Hindi. Use simple language, show working, and finish with a one-line summary answer.",
  qa: "You are a precise Q&A assistant. Give a concise, factual answer. If the question is in Hindi, answer in Hindi. Include a brief explanation only when helpful.",
  resume:
    "You are a professional resume writer for Indian tech and global remote roles. Given the candidate details, output a clean ATS-friendly resume in markdown with sections: Summary, Skills, Experience, Education, Projects. Keep bullets quantified and action-led.",
  essay:
    "You are an essay writer. Produce a well-structured essay with an engaging intro, 3-4 body paragraphs with arguments and examples, and a strong conclusion. Match the language of the user prompt.",
  story:
    "You are a creative storyteller. Write an engaging short story based on the user's prompt with vivid imagery and a satisfying ending. Match the language of the user prompt.",
  bio: "You write short, catchy social media bios under 160 characters. Return 5 numbered variants, mixing emojis tastefully. Match the language of the input.",
  caption:
    "You generate engaging social media captions for Instagram and Facebook. Return 5 variants with relevant hashtags. Match input language: Hindi, English, or Hinglish.",
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
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const prompt = toolPrompts[data.toolId];
    if (!prompt) throw new Error("This tool is a preview placeholder right now.");

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured yet.");

    const provider = createLovableAiGatewayProvider(apiKey);
    const result = await generateText({
      model: provider("google/gemini-2.5-flash"),
      system: prompt,
      prompt: data.input,
    });

    return { text: result.text };
  });