/**
 * @layer server — HTTP Transport
 * Gemini AI conversation routes.
 *
 * This module is the HTTP transport layer for Gemini-powered chat.
 * All database access goes through `@workspace/db` query functions.
 * All AI logic goes through `../../services/ai/`.
 * This file contains zero business logic — only parse → call service/dal → respond.
 */

import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import {
  CreateGeminiConversationBody,
  SendGeminiMessageBody,
  GetGeminiConversationParams,
  DeleteGeminiConversationParams,
  ListGeminiMessagesParams,
  SendGeminiMessageParams,
  GenerateAnnouncementBody,
} from "@workspace/api-zod";
import { conversationQueries, messageQueries } from "@workspace/db";
import { streamGeminiResponse, buildStadiumContext, generateAnnouncement } from "../../services/ai/index.js";

const router: IRouter = Router();

// Rate limit LLM endpoints: 10 requests per minute per IP
const llmRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests to LLM endpoints, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
router.use(llmRateLimiter);

/** Constructs the AI system prompt grounded in live stadium context. */
function buildSystemPrompt(): string {
  return `You are StadiumIQ AI, the intelligent assistant for FIFA World Cup 2026 at MetLife Stadium, New York.

${buildStadiumContext()}

You help fans, operations staff, and volunteers. Be specific, helpful, and ground every response in the actual stadium conditions above. For navigation, safety, amenities, and transport questions, always reference current conditions. Never give generic advice.`;
}

// ---------------------------------------------------------------------------
// Conversation CRUD
// ---------------------------------------------------------------------------

router.get("/gemini/conversations", async (req, res) => {
  try {
    const rows = await conversationQueries.listConversations();
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

router.post("/gemini/conversations", async (req, res) => {
  const parsed = CreateGeminiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const conv = await conversationQueries.createConversation(parsed.data.title);
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

router.get("/gemini/conversations/:id", async (req, res) => {
  const params = GetGeminiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }
  try {
    const conv = await conversationQueries.getConversationWithMessages(params.data.id);
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Failed to get conversation" });
  }
});

router.delete("/gemini/conversations/:id", async (req, res) => {
  const params = DeleteGeminiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }
  try {
    const deleted = await conversationQueries.deleteConversation(params.data.id);
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// ---------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------

router.get("/gemini/conversations/:id/messages", async (req, res) => {
  const params = ListGeminiMessagesParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }
  try {
    const msgs = await messageQueries.listMessages(params.data.id);
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

router.post("/gemini/conversations/:id/messages", async (req, res) => {
  const params = SendGeminiMessageParams.safeParse({ id: Number(req.params.id) });
  const body = SendGeminiMessageBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const convId = params.data.id;
  const userContent = body.data.content;

  try {
    // Verify conversation exists
    const conv = await conversationQueries.getConversationWithMessages(convId);
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Persist user message
    await messageQueries.insertMessage({ conversationId: convId, role: "user", content: userContent });

    // Load full history for context
    const history = await messageQueries.listMessages(convId);

    // Start SSE stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullResponse = "";
    const stream = await streamGeminiResponse(
      history.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
      buildSystemPrompt(),
    );

    for await (const chunk of stream) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // Persist assistant message
    await messageQueries.insertMessage({ conversationId: convId, role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to stream message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate response" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

// ---------------------------------------------------------------------------
// AI Utilities
// ---------------------------------------------------------------------------

router.post("/gemini/announcement", async (req, res) => {
  const parsed = GenerateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const { incidentDescription, severity, zone } = parsed.data;
    const result = await generateAnnouncement(incidentDescription, severity, zone || "Global");
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to generate announcement");
    res.status(500).json({ error: "Failed to generate announcement" });
  }
});

export default router;
