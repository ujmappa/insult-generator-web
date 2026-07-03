import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { GENDERS, getInsult } from '../core/insults.js';

const app = express();
const distDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist');

app.get('/api/v1/insult', (req, res) => {
	// A repeated query parameter arrives as an array — only a string name is acceptable.
	const name = typeof req.query.name === 'string' ? req.query.name.trim() : '';
	const gender = req.query.gender || 'both';

	if (name === '') {
		res.status(400).json({ error: 'The name parameter is required' });
		return;
	}

	if (!GENDERS.includes(gender)) {
		res.status(400).json({ error: 'Invalid gender value' });
		return;
	}

	res.status(200).json({ text: getInsult(name, gender) });
});

// Serve the Vite build (dist); in development the Vite dev server proxies here instead.
app.use(express.static(distDir));
app.get(/^\/(?!api(\/|$)).*/, (req, res) => {
	const indexFile = path.join(distDir, 'index.html');
	if (!existsSync(indexFile)) {
		res.status(503).send('Frontend build is missing — run: npm run build');
		return;
	}
	res.sendFile(indexFile);
});

export default app;
