import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateGeminiConversationBody,
  SendGeminiMessageBody,
  GetGeminiConversationParams,
  DeleteGeminiConversationParams,
  ListGeminiMessagesParams,
  SendGeminiMessageParams,
} from "@workspace/api-zod";
import { streamGeminiResponse, buildStadiumContext } from "../../services/aiService.js";
import {
  getStadiumStatus,
  getIncidents,
  getAlerts,
} from "../../services/stadiumSimulator.js";

const router: IRouter = Router();

// Build a system prompt grounded in live stadium context
function buildSystemPrompt(): string {
  const fullContext = buildStadiumContext();

  return `You are StadiumIQ AI, the intelligent assistant for FIFA World Cup 2026 at MetLife Stadium, New York.

${fullContext}

You help fans, operations staff, and volunteers. Be specific, helpful, and ground every response in the actual stadium conditions above. For navigation, safety, amenities, and transport questions, always reference current conditions. Never give generic advice.`;
}

// List conversations
router.get("/gemini/conversations", async (req, res) => {
  try {
    const rows = await db
      .select()
      .from(conversations)
      .orderBy(conversations.createdAt);
    res.json(rows);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Failed to list conversations" });
  }
});

// Create conversation
router.post("/gemini/conversations", async (req, res) => {
  const parsed = CreateGeminiConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [conv] = await db
      .insert(conversations)
      .values({ title: parsed.data.title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

// Get conversation with messages
router.get("/gemini/conversations/:id", async (req, res) => {
  const params = GetGeminiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  try {
    const conv = await db.query.conversations.findFirst({
      where: eq(conversations.id, params.data.id),
      with: { messages: { orderBy: [messages.createdAt] } },
    });

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

// Delete conversation
router.delete("/gemini/conversations/:id", async (req, res) => {
  const params = DeleteGeminiConversationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  try {
    const deleted = await db
      .delete(conversations)
      .where(eq(conversations.id, params.data.id))
      .returning();

    if (deleted.length === 0) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});

// List messages
router.get("/gemini/conversations/:id/messages", async (req, res) => {
  const params = ListGeminiMessagesParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid conversation ID" });
    return;
  }

  try {
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, params.data.id))
      .orderBy(messages.createdAt);
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Failed to list messages" });
  }
});

// Send message (SSE streaming)
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
    const conv = await db.query.conversations.findFirst({
      where: eq(conversations.id, convId),
    });
    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    // Save user message
    await db.insert(messages).values({
      conversationId: convId,
      role: "user",
      content: userContent,
    });

    // Load conversation history for context
    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, convId))
      .orderBy(messages.createdAt);

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    // Stream Gemini response
    let fullResponse = "";
    const stream = await streamGeminiResponse(
      history.map((m) => ({ role: m.role, content: m.content })),
      buildSystemPrompt()
    );

    for await (const chunk of stream) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    }

    // Save assistant message
    await db.insert(messages).values({
      conversationId: convId,
      role: "assistant",
      content: fullResponse,
    });

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

export default router;
