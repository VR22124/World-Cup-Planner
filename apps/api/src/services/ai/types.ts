export type Persona = "fan" | "operations" | "volunteer";
export type UrgencyLevel = "normal" | "elevated" | "urgent";
export type Priority = "low" | "medium" | "high" | "critical";
export type RecommendationCategory =
  | "crowd_management"
  | "gate_control"
  | "transport"
  | "volunteer"
  | "safety"
  | "accessibility";

export interface AssistanceResponse {
  response: string;
  suggestions: string[];
  urgency: UrgencyLevel;
  relatedZones: string[];
}

export interface OperationalRecommendation {
  id: string;
  priority: Priority;
  category: RecommendationCategory;
  title: string;
  recommendation: string;
  affectedZones: string[];
  generatedAt: string;
}
