import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import geminiRouter from './index.js';

// Mock DB
vi.mock('@workspace/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        orderBy: vi.fn(() => Promise.resolve([
          { id: 1, title: 'Test Conv', createdAt: new Date() }
        ]))
      }))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 2, title: 'New Conv' }]))
      }))
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({
        returning: vi.fn(() => Promise.resolve([{ id: 1 }]))
      }))
    })),
    query: {
      conversations: {
        findFirst: vi.fn(() => Promise.resolve({
          id: 1,
          title: 'Test Conv',
          messages: []
        }))
      }
    }
  },
  eq: vi.fn(),
  conversations: {
    id: 'id',
    createdAt: 'createdAt'
  },
  messages: {
    conversationId: 'conversationId',
    createdAt: 'createdAt'
  }
}));

// Create a dummy express app to test the router
const app = express();
app.use(express.json());
// Add mock logger to req since the real app does this
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
