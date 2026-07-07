import { ai } from "@workspace/integrations-gemini-ai";
import { logger } from "../../lib/logger";
import { buildStadiumContext } from "./contextBuilder";

export async function generateAnnouncement(
  incidentDescription: string,
  severity: string,
  zone: string
): Promise<{ english: string; spanish: string; french: string; portuguese: string }> {
  const context = buildStadiumContext();
  const prompt = `You are StadiumIQ AI. An incident occurred in ${zone}.
Incident: ${incidentDescription} (Severity: ${severity}).
Current stadium context: ${context}

Generate a PA announcement to inform and guide fans safely. The tone must be calm, clear, and authoritative. 
Return ONLY a valid JSON object with the announcement translated into four languages:
{
  "english": "...",
  "spanish": "...",
  "french": "...",
  "portuguese": "..."
}`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { responseMimeType: "application/json", maxOutputTokens: 2048 },
    });

    const parsed = JSON.parse(result.text ?? "{}");
    return {
      english: parsed.english ?? "Attention fans, please remain calm and follow staff instructions.",
      spanish: parsed.spanish ?? "Atención aficionados, por favor mantengan la calma y sigan las instrucciones del personal.",
      french: parsed.french ?? "Attention les fans, veuillez rester calmes et suivre les instructions du personnel.",
      portuguese: parsed.portuguese ?? "Atenção torcedores, por favor mantenham a calma e sigam as instruções da equipe."
    };
  } catch (err) {
    logger.error({ err }, "AI announcement generation failed");
    return {
      english: "Attention fans, please remain calm and follow staff instructions.",
      spanish: "Atención aficionados, por favor mantengan la calma y sigan las instrucciones del personal.",
      french: "Attention les fans, veuillez rester calmes et suivre les instructions du personnel.",
      portuguese: "Atenção torcedores, por favor mantenham a calma e sigam as instruções da equipe."
    };
  }
}
