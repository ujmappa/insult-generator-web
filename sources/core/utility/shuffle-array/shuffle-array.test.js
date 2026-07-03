import { describe, expect, it } from 'vitest';
import shuffleArray from './index.js';

describe('shuffleArray', () => {
	it('returns the same elements', () => {
		const input = ['a', 'b', 'c', 'd', 'e'];
		expect(shuffleArray(input).sort()).toEqual([...input].sort());
	});

	it('does not mutate the original array', () => {
		const input = [1, 2, 3, 4, 5];
		const copy = [...input];
		shuffleArray(input);
		expect(input).toEqual(copy);
	});

	it('returns an empty array for an empty array', () => {
		expect(shuffleArray([])).toEqual([]);
	});

	it('eventually produces a different order', () => {
		const input = [1, 2, 3, 4, 5, 6, 7, 8];
		const shuffled = Array.from({ length: 50 }, () => shuffleArray(input).join(''));
		expect(new Set(shuffled).size).toBeGreaterThan(1);
	});
});
