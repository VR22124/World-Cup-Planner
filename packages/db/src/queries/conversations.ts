/**
 * @layer server — Data Access Layer
 * Typed query functions for the `conversations` table.
 *
 * All database access for conversations MUST go through this module.
 * Services import from here. They never call drizzle inline.
 */

import { db, eq, conversations, messages } from "../index.js";
import type { Conversation } from "../schema/conversations.js";
import type { Message } from "../schema/messages.js";

/** List all conversations ordered by creation time. */
export async function listConversations(): Promise<Conversation[]> {
  return db.select().from(conversations).orderBy(conversations.createdAt);
}

/** Create a new conversation with a given title. Returns the inserted row. */
export async function createConversation(title: string): Promise<Conversation> {
  const [conv] = await db
    .insert(conversations)
    .values({ title })
    .returning();
  if (!conv) throw new Error("Failed to insert conversation");
  return conv;
}

/**
 * Retrieve a single conversation with its messages eagerly loaded.
 * Returns `null` if not found.
 */
export async function getConversationWithMessages(
  id: number,
): Promise<(Conversation & { messages: Message[] }) | null> {
  const result = await db.query.conversations.findFirst({
    where: eq(conversations.id, id),
    with: { messages: { orderBy: [messages.createdAt] } },
  });
  return result ?? null;
}

/** Delete a conversation by ID. Returns the deleted row, or null if not found. */
export async function deleteConversation(id: number): Promise<Conversation | null> {
  const deleted = await db
    .delete(conversations)
    .where(eq(conversations.id, id))
    .returning();
  return deleted[0] ?? null;
}
