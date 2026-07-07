/**
 * @layer client — Server Contract Boundary
 * Query key factories.
 *
 * Centralised, typed query keys for all TanStack React Query caches.
 * Using factory functions ensures keys are consistent across the app
 * and eliminates hardcoded string arrays scattered across components.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: queryKeys.stadium.gates() })
 */

export const queryKeys = {
  stadium: {
    /** Root key — invalidates all stadium data */
    all: () => ["stadium"] as const,
    status: () => ["stadium", "status"] as const,
    gates: () => ["stadium", "gates"] as const,
    crowd: () => ["stadium", "crowd"] as const,
    transport: () => ["stadium", "transport"] as const,
    incidents: () => ["stadium", "incidents"] as const,
    volunteers: () => ["stadium", "volunteers"] as const,
    alerts: () => ["stadium", "alerts"] as const,
    accessibility: () => ["stadium", "accessibility"] as const,
    sustainability: () => ["stadium", "sustainability"] as const,
  },

  ai: {
    /** Root key — invalidates all AI data */
    all: () => ["ai"] as const,
    recommendations: () => ["ai", "recommendations"] as const,
    assist: (query: string, persona: string) => ["ai", "assist", query, persona] as const,
  },

  gemini: {
    /** Root key — invalidates all gemini conversation data */
    all: () => ["gemini"] as const,
    conversations: () => ["gemini", "conversations"] as const,
    conversation: (id: number) => ["gemini", "conversations", id] as const,
    messages: (conversationId: number) => ["gemini", "conversations", conversationId, "messages"] as const,
  },

  health: {
    all: () => ["health"] as const,
    check: () => ["health", "check"] as const,
  },
} as const;
