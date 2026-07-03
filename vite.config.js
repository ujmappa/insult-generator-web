import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// One source of truth for the API port: both the server and the proxy read PORT from .env.
const apiPort = process.env.PORT || 3000;

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': `http://localhost:${apiPort}`
		}
	},
	test: {
		globals: true,
		exclude: ['node_modules/**', 'tests/e2e/**']
	}
});
