// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InsultForm from './InsultForm.jsx';

describe('InsultForm', () => {
	it('shows an error for an empty name and does not generate', () => {
		const onGenerate = vi.fn();
		render(<InsultForm onGenerate={onGenerate} loading={false} />);

		fireEvent.click(screen.getByRole('button', { name: /szidjad/i }));

		expect(screen.getByRole('alert').textContent).toBe('Előbb áruld el, kit illet a szó!');
		expect(onGenerate).not.toHaveBeenCalled();
	});

	it('submits the trimmed name and the selected gender', () => {
		const onGenerate = vi.fn();
		render(<InsultForm onGenerate={onGenerate} loading={false} />);

		fireEvent.change(screen.getByLabelText('Kit szidjunk?'), { target: { value: '  Bözsi  ' } });
		fireEvent.change(screen.getByLabelText('Az illető neme'), { target: { value: 'female' } });
		fireEvent.click(screen.getByRole('button', { name: /szidjad/i }));

		expect(onGenerate).toHaveBeenCalledWith({ name: 'Bözsi', gender: 'female' });
	});

	it('clears the error while typing', () => {
		render(<InsultForm onGenerate={vi.fn()} loading={false} />);

		fireEvent.click(screen.getByRole('button', { name: /szidjad/i }));
		expect(screen.getByRole('alert')).toBeTruthy();

		fireEvent.change(screen.getByLabelText('Kit szidjunk?'), { target: { value: 'B' } });
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('disables the button while loading', () => {
		render(<InsultForm onGenerate={vi.fn()} loading={true} />);
		expect(screen.getByRole('button', { name: /szidjad/i }).disabled).toBe(true);
	});
});
