/**
 * @layer server — Data Access Layer
 * Typed query functions for the `messages` table.
 *
 * All database access for messages MUST go through this module.
 */

import { db, eq, messages } from "../index.js";
import type { Message } from "../schema/messages.js";

/** List all messages for a conversation, ordered by creation time. */
export async function listMessages(conversationId: number): Promise<Message[]> {
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

/** Insert a new message (user or assistant) for a given conversation. */
export async function insertMessage(params: {
  conversationId: number;
  role: string;
  content: string;
}): Promise<Message> {
  const [msg] = await db
    .insert(messages)
    .values(params)
    .returning();
  if (!msg) throw new Error("Failed to insert message");
  return msg;
}
