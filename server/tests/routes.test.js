import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

test('category administration requires authentication', async () => {
  const response = await request(app).get('/api/project-categories/all');
  assert.equal(response.status, 401);
});

test('media validation requires authentication', async () => {
  const response = await request(app).post('/api/media/validate').send({ url: 'javascript:alert(1)' });
  assert.equal(response.status, 401);
});

test('media health reports provider configuration without secrets', async () => {
  const response = await request(app).get('/api/media/health');
  assert.equal(response.status, 200);
  assert.ok(['unconfigured', 's3-compatible'].includes(response.body.data.provider));
});
