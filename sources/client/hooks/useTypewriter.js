import { useEffect, useState } from 'react';

const MAX_DURATION_MS = 10_000;

export function useTypewriter(text, speed = 28) {
	const [length, setLength] = useState(0);

	useEffect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			setLength(text.length);
			return;
		}
		setLength(0);
		// Even a long insult should not take more than ten seconds to type out.
		const interval = Math.min(speed, Math.ceil(MAX_DURATION_MS / Math.max(text.length, 1)));
		const timer = setInterval(() => {
			setLength(current => {
				if (current >= text.length) {
					clearInterval(timer);
					return current;
				}
				return current + 1;
			});
		}, interval);
		return () => clearInterval(timer);
	}, [text, speed]);

	return { visible: text.slice(0, length), done: length >= text.length };
}
