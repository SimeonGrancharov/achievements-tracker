import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { getFirebaseToken } from '../test/helpers';
import { db } from '../firebase';

describe('achievements routes', () => {
  let token: string;
  let createdId: string;

  beforeAll(async () => {
    token = await getFirebaseToken();
  });

  afterAll(async () => {
    // Clean up test data
    if (createdId) {
      await db.collection('achievements').doc(createdId).delete();
    }
  });

  describe('GET /api/achievements', () => {
    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/achievements');
      expect(res.status).toBe(401);
    });

    it('should return achievements with valid token', async () => {
      const res = await request(app)
        .get('/api/achievements')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/achievements', () => {
    it('should return 401 without token', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .send({ name: 'Test', description: 'Test', achievements: [] });

      expect(res.status).toBe(401);
    });

    it('should create achievement with valid token', async () => {
      const res = await request(app)
        .post('/api/achievements')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Integration Test',
          description: 'Created by integration test',
          achievements: [],
        });

      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.name).toBe('Integration Test');
      expect(res.body.createdAt).toBeDefined();

      createdId = res.body.id;
    });
  });

  describe('GET /api/achievements/:id', () => {
    it('should return 404 for nonexistent id', async () => {
      const res = await request(app)
        .get('/api/achievements/nonexistent-id')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('should return achievement by id', async () => {
      const res = await request(app)
        .get(`/api/achievements/${createdId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdId);
    });
  });

  describe('PATCH /api/achievements/:id', () => {
    it('should update achievement', async () => {
      const res = await request(app)
        .patch(`/api/achievements/${createdId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Name');
    });
  });

  describe('POST /api/achievements/:id/items', () => {
    it('should add achievement item', async () => {
      const res = await request(app)
        .post(`/api/achievements/${createdId}/items`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Item',
          description: 'A test achievement item',
          size: 'M',
          type: 'Feature',
        });

      expect(res.status).toBe(201);
      expect(res.body.achievements).toHaveLength(1);
      expect(res.body.achievements[0].name).toBe('Test Item');
    });
  });

  describe('DELETE /api/achievements/:id', () => {
    it('should delete achievement', async () => {
      const res = await request(app)
        .delete(`/api/achievements/${createdId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
      createdId = ''; // Clear so afterAll doesn't try to delete again
    });
  });
});
