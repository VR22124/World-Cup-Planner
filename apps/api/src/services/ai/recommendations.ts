import { ai } from "@workspace/integrations-gemini-ai";
import { logger } from "../../lib/logger";
import { buildStadiumContext } from "./contextBuilder";
import { OperationalRecommendation } from "./types";

const FALLBACK_RECOMMENDATIONS: OperationalRecommendation[] = [
  {
    id: "REC-FALLBACK-1",
    priority: "high",
    category: "crowd_management",
    title: "Relieve Concourse Congestion",
    recommendation: "Redirect fans from North Concourse to East Concourse using digital signage.",
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
  },
];

export async function getOperationalRecommendations(): Promise<OperationalRecommendation[]> {
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
      config: { responseMimeType: "application/json", maxOutputTokens: 8192 },
    });

    const text = result.text ?? "[]";
    const parsed = JSON.parse(text) as Array<Partial<OperationalRecommendation>>;

    if (!Array.isArray(parsed)) throw new Error("Gemini returned non-array response");

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
    logger.error({ err }, "AI recommendations request failed — returning fallback");
    return FALLBACK_RECOMMENDATIONS;
  }
}
