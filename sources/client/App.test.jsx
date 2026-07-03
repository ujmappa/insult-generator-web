// @vitest-environment jsdom
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion } from './test-helpers.js';
import App from './App.jsx';

const generateWith = (name) => {
	fireEvent.change(screen.getByLabelText('Kit szidjunk?'), { target: { value: name } });
	fireEvent.click(screen.getByRole('button', { name: /szidjad/i }));
};

describe('App', () => {
	beforeEach(() => {
		// Reduced motion: the typewriter animation yields the full text immediately.
		mockReducedMotion(true);
	});

	it('shows the invitation in the empty state', () => {
		render(<App />);
		expect(screen.getByText(/ide hímezzük a szitkot/i)).toBeTruthy();
	});

	it('displays the insult on a successful response', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => ({ text: 'Bözsi, te átkozott csaló!' }),
		});
		render(<App />);

		generateWith('Bözsi');

		// The text appears both in the visible typed paragraph and in the sr-only live region.
		await waitFor(() => expect(screen.getAllByText(/Bözsi, te átkozott csaló!/).length).toBeGreaterThan(0));
		expect(global.fetch).toHaveBeenCalledWith('/api/v1/insult?name=B%C3%B6zsi&gender=both');
	});

	it('shows the API error message on an error response', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			json: async () => ({ error: 'Invalid gender value' }),
		});
		render(<App />);

		generateWith('Bözsi');

		await waitFor(() => expect(screen.getByText('Invalid gender value')).toBeTruthy());
	});

	it('shows the Hungarian fallback message on a network failure', async () => {
		global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
		render(<App />);

		generateWith('Bözsi');

		await waitFor(() =>
			expect(screen.getByText('A szitokgép megmakacsolta magát, próbáld újra!')).toBeTruthy()
		);
	});
});
