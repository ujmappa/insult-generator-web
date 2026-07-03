import { useState } from 'react';
import { CircleAlert } from 'lucide-react';
import InsultForm from './components/InsultForm.jsx';
import InsultResult from './components/InsultResult.jsx';

export default function App() {
	const [insult, setInsult] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [round, setRound] = useState(0);

	async function generate({ name, gender }) {
		setLoading(true);
		setError(null);
		try {
			const params = new URLSearchParams({ name, gender });
			const response = await fetch(`/api/v1/insult?${params}`);
			const data = await response.json().catch(() => ({}));
			if (!response.ok || data.error) {
				setError(data.error || 'A szitokgép megmakacsolta magát, próbáld újra!');
				return;
			}
			setInsult(data.text);
			setRound(current => current + 1);
		} catch {
			// Network failure: show our own copy instead of the browser's raw error message.
			setError('A szitokgép megmakacsolta magát, próbáld újra!');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="page">
			<header className="masthead">
				<p className="eyebrow">Népi szitokgyűjtemény</p>
				<h1>Cifra káromkodások</h1>
				<p className="lead">
					Írd be, kit illet a szó, s úgy elszidjuk, hogy a hetedik határban is megemlegeti.
				</p>
			</header>

			<main>
				<InsultForm onGenerate={generate} loading={loading} />

				{error && (
					<p className="error-banner" role="alert">
						<CircleAlert size={18} aria-hidden="true" />
						{error}
					</p>
				)}

				<InsultResult insult={insult} round={round} />
			</main>

			<footer className="colophon">
				<p>Régi magyar szitkozódások nyomán, szeretettel.</p>
			</footer>
		</div>
	);
}
