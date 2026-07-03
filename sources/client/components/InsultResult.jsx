import { Feather } from 'lucide-react';
import TulipDivider from './TulipDivider.jsx';
import { useTypewriter } from '../hooks/useTypewriter.js';

function TypedInsult({ text }) {
	const { visible, done } = useTypewriter(text);
	return (
		<blockquote className="curse">
			{/* The per-character text is hidden from screen readers; they get the stable sr-only region. */}
			<p className="curse-text" aria-hidden="true">
				{visible}
				{!done && <span className="caret" aria-hidden="true" />}
			</p>
		</blockquote>
	);
}

export default function InsultResult({ insult, round }) {
	return (
		<section className="sampler-wrap">
			<TulipDivider key={round} animate={Boolean(insult)} />
			<div className="sampler">
				<div className="sampler-inner">
					{insult ? (
						<TypedInsult key={round} text={insult} />
					) : (
						<div className="sampler-empty">
							<Feather size={26} aria-hidden="true" />
							<p>Ide hímezzük a szitkot, amint elárultad, ki érdemli.</p>
						</div>
					)}
				</div>
			</div>
			<p className="sr-only" aria-live="polite">{insult ?? ''}</p>
		</section>
	);
}
