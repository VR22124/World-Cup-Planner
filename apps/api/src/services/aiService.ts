/**
 * AI Service — uses Gemini to generate contextual stadium assistance
 * and operational recommendations based on live simulated stadium state.
 */

import { ai } from "@workspace/integrations-gemini-ai";
import {
  getStadiumStatus,
  getGates,
  getCrowdHeatmap,
  getTransport,
  getIncidents,
  getAlerts,
} from "./stadiumSimulator.js";

type Persona = "fan" | "operations" | "volunteer";
type UrgencyLevel = "normal" | "elevated" | "urgent";
type Priority = "low" | "medium" | "high" | "critical";
type RecommendationCategory =
  | "crowd_management"
  | "gate_control"
  | "transport"
  | "volunteer"
  | "safety"
  | "accessibility";

export function buildStadiumContext(): string {
  const status = getStadiumStatus();
  const gates = getGates();
  const crowd = getCrowdHeatmap();
  const transport = getTransport();
  const incidents = getIncidents().filter((i) => i.status !== "resolved");
  const alerts = getAlerts().filter((a) => !a.acknowledged);

  const closedGates = gates
    .filter((g) => g.status === "closed")
    .map((g) => `${g.name} (CLOSED - ${g.densityPercent}% capacity)`)
    .join(", ");

  const congestedGates = gates
    .filter((g) => g.status === "congested")
    .map((g) => `${g.name} (${g.densityPercent}% capacity, ${g.queueLengthMinutes}min queue)`)
    .join(", ");

  const criticalZones = crowd
    .filter((z) => z.level === "critical" || z.level === "high")
    .map((z) => `${z.zoneName} (${z.densityPercent}%)`)
    .join(", ");

  const transportIssues = transport
    .filter((t) => t.status !== "on_time")
    .map((t) => `${t.name}: ${t.status} (+${t.delayMinutes}min)`)
    .join(", ");

  return `
STADIUM: MetLife Stadium, New York — FIFA World Cup 2026
MATCH: ${status.matchStatus.homeTeam} ${status.matchStatus.homeScore}-${status.matchStatus.awayScore} ${status.matchStatus.awayTeam} | Minute ${status.matchStatus.minute} | Phase: ${status.matchStatus.phase}
ATTENDANCE: ${status.totalAttendance.toLocaleString()} (${status.capacityPercent}% capacity) | Overall crowd: ${status.overallCrowdLevel.toUpperCase()}
WEATHER: ${status.weather.condition}, ${status.weather.temperatureCelsius}°C, Humidity ${status.weather.humidity}%, Wind ${status.weather.windKph}km/h, UV ${status.weather.uvIndex}
CLOSED GATES: ${closedGates || "None"}
CONGESTED GATES: ${congestedGates || "None"}
HIGH DENSITY ZONES: ${criticalZones || "None"}
TRANSPORT ISSUES: ${transportIssues || "None"}
ACTIVE INCIDENTS: ${incidents.length} (${incidents.filter((i) => i.severity === "critical" || i.severity === "high").length} high+)
ACTIVE ALERTS: ${alerts.length} (${alerts.filter((a) => a.level === "critical").length} critical)
  `.trim();
}

export async function getAssistance(
  query: string,
  persona: Persona,
  language = "English"
): Promise<{
  response: string;
  suggestions: string[];
  urgency: UrgencyLevel;
  relatedZones: string[];
}> {
  const context = buildStadiumContext();

  const systemPrompt = `You are StadiumIQ AI, the intelligent operations assistant for the FIFA World Cup 2026 at MetLife Stadium, New York. You have real-time access to stadium data.

CURRENT STADIUM STATE:
${context}

You are assisting a ${persona === "fan" ? "fan attending the match" : persona === "operations" ? "stadium operations team member" : "stadium volunteer"}.

${persona === "fan" ? "Help the fan navigate, find amenities, understand crowd conditions, and have a great experience. Be friendly, clear, and concise." : ""}
${persona === "operations" ? "Provide precise operational intelligence. Be direct, use data, prioritize safety and efficiency." : ""}
${persona === "volunteer" ? "Give the volunteer clear task guidance, safety information, and situational awareness. Be actionable." : ""}

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
    const parsed = JSON.parse(text) as {
      response?: string;
      suggestions?: string[];
      urgency?: UrgencyLevel;
      relatedZones?: string[];
    };
    
    return {
      response: parsed.response ?? "I was unable to generate a response. Please try again.",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 3) : [],
      urgency: parsed.urgency ?? "normal",
      relatedZones: Array.isArray(parsed.relatedZones) ? parsed.relatedZones : [],
    };
  } catch (err) {
    console.error("AI Assistance Error (falling back to mock):", err);
    return {
      response: "The AI assistant is currently experiencing high demand (Rate Limited). I am a fallback response. Please try again shortly.",
      suggestions: ["Check stadium map", "Find my seat", "Contact support"],
      urgency: "normal",
      relatedZones: [],
    };
  }
}

export async function getOperationalRecommendations(): Promise<
  Array<{
    id: string;
    priority: Priority;
    category: RecommendationCategory;
    title: string;
    recommendation: string;
    affectedZones: string[];
    generatedAt: string;
  }>
> {
  const context = buildStadiumContext();

  const prompt = `You are StadiumIQ AI analyzing real-time conditions at FIFA World Cup 2026, MetLife Stadium.

CURRENT STADIUM STATE:
${context}

Generate exactly 5 prioritized operational recommendations for the operations team. Each recommendation must be specific, actionable, and grounded in the actual data above.

Respond as a JSON array:
[
  {
    "id": "REC-001",
    "priority": "critical",
    "category": "crowd_management",
    "title": "Short title",
    "recommendation": "Specific actionable recommendation with details",
    "affectedZones": ["Zone A", "Zone B"],
    "generatedAt": "${new Date().toISOString()}"
  }
]

Categories: crowd_management, gate_control, transport, volunteer, safety, accessibility
Priorities: low, medium, high, critical

Return only the JSON array, no other text.`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const text = result.text ?? "[]";
    const parsed = JSON.parse(text) as Array<{
      id?: string;
      priority?: Priority;
      category?: RecommendationCategory;
      title?: string;
      recommendation?: string;
      affectedZones?: string[];
      generatedAt?: string;
    }>;

    if (!Array.isArray(parsed)) throw new Error("Not an array");

    return parsed.slice(0, 5).map((r, i) => ({
      id: r.id ?? `REC-${String(i + 1).padStart(3, "0")}`,
      priority: r.priority ?? "medium",
      category: r.category ?? "crowd_management",
      title: r.title ?? "Recommendation",
      recommendation: r.recommendation ?? "",
      affectedZones: Array.isArray(r.affectedZones) ? r.affectedZones : [],
      generatedAt: r.generatedAt ?? new Date().toISOString(),
    }));
  } catch (err) {
    console.error("AI Recommendation Error (falling back to mock):", err);
    return [
      {
        id: "REC-FALLBACK-1",
        priority: "high",
        category: "crowd_management",
        title: "Relieve Concourse Congestion",
        recommendation: "Redirect fans from North Concourse to East Concourse using digital signage to balance the load.",
        affectedZones: ["North Concourse", "East Concourse"],
        generatedAt: new Date().toISOString(),
      },
      {
        id: "REC-FALLBACK-2",
        priority: "medium",
        category: "gate_control",
        title: "Open Secondary Gates",
        recommendation: "Open secondary security lines at Gate A to process incoming crowds efficiently.",
        affectedZones: ["Gate A"],
        generatedAt: new Date().toISOString(),
      },
      {
        id: "REC-FALLBACK-3",
        priority: "low",
        category: "transport",
        title: "Deploy Additional Shuttles",
        recommendation: "Request additional shuttles to clear the Metro Hub.",
        affectedZones: ["Metro Hub"],
        generatedAt: new Date().toISOString(),
      }
    ];
  }
}

export async function* streamGeminiResponse(
  messages: Array<{ role: string; content: string }>,
  systemPrompt?: string
): AsyncGenerator<string> {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user" as "user" | "model",
    parts: [{ text: m.content }],
  }));

  const config: Record<string, unknown> = { maxOutputTokens: 8192 };
  if (systemPrompt) {
    config.systemInstruction = systemPrompt;
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
    console.error("AI Streaming Error (falling back):", err);
    yield "The AI assistant is currently experiencing high demand (Rate Limited). Please try again shortly. I am a fallback response.";
  }
}
