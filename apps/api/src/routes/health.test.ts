// @ts-nocheck
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Health API', () => {
  it('should return system status', async () => {
    const response = await request(app).get('/api/healthz');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });
});
