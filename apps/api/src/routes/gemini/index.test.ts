import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import geminiRouter from './index.js';

const mockConversation = { id: 1, title: 'Test Conv', createdAt: new Date(), messages: [] };

// Mock @workspace/db — now the route uses DAL query functions, not raw drizzle
vi.mock('@workspace/db', () => ({
  conversationQueries: {
    listConversations: vi.fn(() => Promise.resolve([mockConversation])),
    createConversation: vi.fn((title: string) => Promise.resolve({ id: 2, title, createdAt: new Date() })),
    getConversationWithMessages: vi.fn((id: number) =>
      id === 1 ? Promise.resolve(mockConversation) : Promise.resolve(null)
    ),
    deleteConversation: vi.fn((id: number) =>
      id === 1 ? Promise.resolve(mockConversation) : Promise.resolve(null)
    ),
  },
  messageQueries: {
    listMessages: vi.fn(() => Promise.resolve([])),
    insertMessage: vi.fn(() => Promise.resolve({ id: 1, role: 'user', content: 'hi', conversationId: 1, createdAt: new Date() })),
  },
  // Unused but required to satisfy the module shape
  db: {},
  eq: vi.fn(),
  conversations: {},
  messages: {},
}));

// Mock AI service (no real Gemini calls during tests)
vi.mock('../../services/ai/index.js', () => ({
  streamGeminiResponse: vi.fn(async function* () { yield 'ok'; }),
  buildStadiumContext: vi.fn(() => 'STADIUM: Test'),
  generateAnnouncement: vi.fn(() => Promise.resolve({ en: 'Attention please' })),
}));

const app = express();
app.use(express.json());
app.use((req, _res, next) => {
  (req as any).log = { error: vi.fn() };
  next();
});
app.use(geminiRouter);

describe('Gemini Routes', () => {
  it('GET /gemini/conversations returns list', async () => {
    const res = await request(app).get('/gemini/conversations');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Test Conv');
  });

  it('POST /gemini/conversations creates new conversation', async () => {
    const res = await request(app)
      .post('/gemini/conversations')
      .send({ title: 'New Conv' });
    expect(res.status).toBe(201);
    expect(res.body.title).toBe('New Conv');
  });

  it('GET /gemini/conversations/:id returns conversation', async () => {
    const res = await request(app).get('/gemini/conversations/1');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Test Conv');
  });

  it('DELETE /gemini/conversations/:id deletes conversation', async () => {
    const response = await request(app).delete('/gemini/conversations/1');
    expect(response.status).toBe(204);
  });
});
