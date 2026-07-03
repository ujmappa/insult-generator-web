import { expect, test } from '@playwright/test';

test('shows the masthead and the empty state', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Cifra káromkodások' })).toBeVisible();
	await expect(page.getByText('Ide hímezzük a szitkot')).toBeVisible();
});

test('shows an inline error for an empty name without calling the API', async ({ page }) => {
	let apiCalled = false;
	await page.route('**/api/v1/insult*', route => {
		apiCalled = true;
		route.continue();
	});
	await page.goto('/');
	await page.getByRole('button', { name: 'Szidjad!' }).click();
	await expect(page.getByText('Előbb áruld el, kit illet a szó!')).toBeVisible();
	expect(apiCalled).toBe(false);
});

test('types out the insult after a name is entered', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Kit szidjunk?').fill('Vendel');
	await page.getByRole('button', { name: 'Szidjad!' }).click();

	const curse = page.locator('.curse-text');
	await expect(curse).toContainText('Vendel', { timeout: 15_000 });

	// The caret disappearing marks the end of typing; the text then ends with punctuation.
	await expect(page.locator('.caret')).toHaveCount(0, { timeout: 20_000 });
	await expect(curse).toContainText(/[!?]$/);
});

test('the selected gender reaches the API', async ({ page }) => {
	let requestedUrl;
	await page.route('**/api/v1/insult*', route => {
		requestedUrl = route.request().url();
		route.continue();
	});
	await page.goto('/');
	await page.getByLabel('Kit szidjunk?').fill('Bözsi');
	await page.getByLabel('Az illető neme').selectOption('female');
	await page.getByRole('button', { name: 'Szidjad!' }).click();
	await expect(page.locator('.curse-text')).toContainText('Bözsi', { timeout: 15_000 });
	expect(requestedUrl).toContain('gender=female');
});

test('shows an error message on a server error', async ({ page }) => {
	await page.route('**/api/v1/insult*', route =>
		route.fulfill({ status: 500, contentType: 'application/json', body: '{}' })
	);
	await page.goto('/');
	await page.getByLabel('Kit szidjunk?').fill('Vendel');
	await page.getByRole('button', { name: 'Szidjad!' }).click();
	await expect(page.getByText('A szitokgép megmakacsolta magát, próbáld újra!')).toBeVisible();
});
