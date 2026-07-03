import { useState } from 'react';
import { ChevronDown, Flame } from 'lucide-react';

export default function InsultForm({ onGenerate, loading }) {
	const [name, setName] = useState('');
	const [gender, setGender] = useState('both');
	const [nameError, setNameError] = useState(null);

	function handleSubmit(event) {
		event.preventDefault();
		if (!name.trim()) {
			setNameError('Előbb áruld el, kit illet a szó!');
			return;
		}
		setNameError(null);
		onGenerate({ name: name.trim(), gender });
	}

	return (
		<form className="insult-form" onSubmit={handleSubmit} noValidate>
			<div className="field">
				<label htmlFor="name">Kit szidjunk?</label>
				<input
					id="name"
					type="text"
					value={name}
					placeholder="pl. Lajos"
					autoFocus
					aria-invalid={Boolean(nameError)}
					onChange={event => {
						setName(event.target.value);
						if (nameError) setNameError(null);
					}}
				/>
				{nameError && (
					<p className="field-error" role="alert">{nameError}</p>
				)}
			</div>

			<div className="field">
				<label htmlFor="gender">Az illető neme</label>
				<div className="select-wrap">
					<select id="gender" value={gender} onChange={event => setGender(event.target.value)}>
						<option value="both">Mindegy</option>
						<option value="male">Férfi</option>
						<option value="female">Nő</option>
					</select>
					<ChevronDown className="select-chevron" size={16} aria-hidden="true" />
				</div>
			</div>

			<button type="submit" className="generate" disabled={loading}>
				<Flame size={20} aria-hidden="true" />
				Szidjad!
			</button>
		</form>
	);
}
