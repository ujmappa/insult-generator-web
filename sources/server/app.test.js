import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from './app.js';

describe('GET /api/v1/insult', () => {
	it('returns 400 without a name', async () => {
		const response = await request(app).get('/api/v1/insult');
		expect(response.status).toBe(400);
		expect(response.body.error).toBe('The name parameter is required');
	});

	it('returns 400 for a whitespace-only name', async () => {
		const response = await request(app).get('/api/v1/insult').query({ name: '   ' });
		expect(response.status).toBe(400);
		expect(response.body.error).toBe('The name parameter is required');
	});

	it('returns 400 for an invalid gender', async () => {
		const response = await request(app).get('/api/v1/insult').query({ name: 'Lajos', gender: 'robot' });
		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid gender value');
	});

	it.each(['male', 'female', 'both'])('returns an insult for a valid request (%s)', async (gender) => {
		const response = await request(app).get('/api/v1/insult').query({ name: 'Vendel', gender });
		expect(response.status).toBe(200);
		expect(response.body.text).toContain('Vendel');
		expect(response.body.text).toMatch(/[!?]$/);
	});

	it('defaults to both when no gender is sent', async () => {
		const response = await request(app).get('/api/v1/insult').query({ name: 'Vendel' });
		expect(response.status).toBe(200);
		expect(response.body.text).toContain('Vendel');
	});

	it('trims whitespace around the name', async () => {
		const response = await request(app).get('/api/v1/insult').query({ name: '  Vendel  ' });
		expect(response.status).toBe(200);
		expect(response.body.text).not.toContain('  Vendel');
	});

	it('returns 400 for a repeated name parameter (array)', async () => {
		const response = await request(app).get('/api/v1/insult?name=a&name=b');
		expect(response.status).toBe(400);
		expect(response.body.error).toBe('The name parameter is required');
	});

	it('does not let the bare /api path fall through to the SPA fallback', async () => {
		const response = await request(app).get('/api');
		expect(response.status).toBe(404);
	});
});
