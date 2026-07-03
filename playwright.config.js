import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const apiPort = process.env.PORT || 3000;

export default defineConfig({
	testDir: 'tests/e2e',
	use: {
		baseURL: 'http://localhost:5173'
	},
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }
	],
	webServer: [
		{
			command: 'node sources/server/index.js',
			url: `http://localhost:${apiPort}/api/v1/insult?name=proba`,
			reuseExistingServer: !process.env.CI
		},
		{
			command: 'npx vite --strictPort',
			url: 'http://localhost:5173',
			reuseExistingServer: !process.env.CI
		}
	]
});
