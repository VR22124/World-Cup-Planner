import { ai } from "@workspace/integrations-gemini-ai";
import { logger } from "../../lib/logger";
import { buildStadiumContext } from "./contextBuilder";
import { Persona, AssistanceResponse } from "./types";

const PERSONA_INSTRUCTIONS: Record<Persona, string> = {
  fan: "Help the fan navigate, find amenities, understand crowd conditions, and have a great experience. Be friendly, clear, and concise.",
  operations: "Provide precise operational intelligence. Be direct, use data, prioritize safety and efficiency.",
  volunteer: "Give the volunteer clear task guidance, safety information, and situational awareness. Be actionable.",
};

export async function getAssistance(
  query: string,
  persona: Persona,
  language = "English",
): Promise<AssistanceResponse> {
  const context = buildStadiumContext();

  const personaLabel =
    persona === "fan" ? "fan attending the match" :
    persona === "operations" ? "stadium operations team member" :
    "stadium volunteer";

  const systemPrompt = `You are StadiumIQ AI, the intelligent operations assistant for the FIFA World Cup 2026 at MetLife Stadium, New York. You have real-time access to stadium data.

CURRENT STADIUM STATE:
${context}

You are assisting a ${personaLabel}.

${PERSONA_INSTRUCTIONS[persona]}

Respond in ${language}. Be specific and ground your response in the actual stadium data provided. Never give generic advice — always reference real conditions.

After your main response, also provide:
- 2-3 short follow-up suggestions (as a JSON array in your response)
- Urgency level: "normal", "elevated", or "urgent" based on the situation
- Related zone names from the stadium (as a JSON array)

Format your response as JSON:
{
  "response": "your main response here",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "urgency": "normal",
  "relatedZones": ["Zone A", "Zone B"]
}`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: query }] }],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const text = result.text ?? "{}";
    const parsed = JSON.parse(text) as Partial<AssistanceResponse>;

    return {
      response: parsed.response ?? "I was unable to generate a response. Please try again.",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
      urgency: parsed.urgency ?? "normal",
      relatedZones: Array.isArray(parsed.relatedZones) ? parsed.relatedZones : [],
    };
  } catch (err) {
    logger.error({ err }, "AI assistance request failed — returning fallback");
    return {
      response: "The AI assistant is currently experiencing high demand. Please try again shortly.",
      suggestions: ["Check stadium map", "Find my seat", "Contact support"],
      urgency: "normal",
      relatedZones: [],
    };
  }
}

export async function* streamGeminiResponse(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string,
): AsyncGenerator<string> {
  const contents = messages.map((m) => ({
    role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
    parts: [{ text: m.content }],
  }));

  const config: Record<string, unknown> = { maxOutputTokens: 8192 };
  if (systemPrompt) {
    config["systemInstruction"] = systemPrompt;
  }

  try {
    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        yield text;
      }
    }
  } catch (err) {
    logger.error({ err }, "AI streaming failed — yielding fallback message");
    yield "The AI assistant is currently experiencing high demand. Please try again shortly.";
  }
}
