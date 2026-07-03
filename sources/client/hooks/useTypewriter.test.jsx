// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockReducedMotion } from '../test-helpers.js';
import { useTypewriter } from './useTypewriter.js';

describe('useTypewriter', () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it('types the text character by character', () => {
		mockReducedMotion(false);
		const { result } = renderHook(() => useTypewriter('szia', 10));
		expect(result.current.visible).toBe('');
		expect(result.current.done).toBe(false);

		act(() => vi.advanceTimersByTime(20));
		expect(result.current.visible).toBe('sz');

		act(() => vi.advanceTimersByTime(1000));
		expect(result.current.visible).toBe('szia');
		expect(result.current.done).toBe(true);
	});

	it('returns the full text immediately under reduced motion', () => {
		mockReducedMotion(true);
		const { result } = renderHook(() => useTypewriter('szia', 10));
		expect(result.current.visible).toBe('szia');
		expect(result.current.done).toBe(true);
	});

	it('stops the timer on unmount', () => {
		mockReducedMotion(false);
		const clearSpy = vi.spyOn(globalThis, 'clearInterval');
		const { unmount } = renderHook(() => useTypewriter('szia', 10));
		unmount();
		expect(clearSpy).toHaveBeenCalled();
	});
});
