import { vi } from 'vitest';

// jsdom has no matchMedia; mock it for the prefers-reduced-motion query.
export const mockReducedMotion = (matches) => {
	window.matchMedia = vi.fn().mockReturnValue({ matches });
};
