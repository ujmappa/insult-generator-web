import { describe, expect, it } from 'vitest';
import { compileTemplate, renderTemplate } from './templating.js';

describe('compileTemplate', () => {
	it('compiles plain text to a single text node', () => {
		expect(compileTemplate('Hogy az a magasságos!')).toEqual([
			{ type: 'text', value: 'Hogy az a magasságos!' },
		]);
	});

	it('compiles a plain placeholder to exactly one expression', () => {
		expect(compileTemplate('${adjective}')).toEqual([
			{ type: 'slot', kind: 'adjective', min: 1, max: 1 },
		]);
	});

	it('compiles a starred placeholder to one-to-three expressions', () => {
		expect(compileTemplate('${adjective*}')).toEqual([
			{ type: 'slot', kind: 'adjective', min: 1, max: 3 },
		]);
	});

	it('supports an explicit count', () => {
		expect(compileTemplate('${adjective*2}')).toEqual([
			{ type: 'slot', kind: 'adjective', min: 2, max: 2 },
		]);
	});

	it('supports a count range', () => {
		expect(compileTemplate('${adjective*2-4}')).toEqual([
			{ type: 'slot', kind: 'adjective', min: 2, max: 4 },
		]);
	});

	it('keeps text and placeholders in order', () => {
		expect(compileTemplate('${username}, te ${adjective*} ${statement}!')).toEqual([
			{ type: 'slot', kind: 'username', min: 1, max: 1 },
			{ type: 'text', value: ', te ' },
			{ type: 'slot', kind: 'adjective', min: 1, max: 3 },
			{ type: 'text', value: ' ' },
			{ type: 'slot', kind: 'statement', min: 1, max: 1 },
			{ type: 'text', value: '!' },
		]);
	});

	it('throws on an unclosed placeholder', () => {
		expect(() => compileTemplate('te ${adjective')).toThrow(/placeholder/i);
	});

	it('throws on a malformed placeholder', () => {
		expect(() => compileTemplate('te ${adje ctive}')).toThrow(/placeholder/i);
	});

	it('throws on a zero count', () => {
		expect(() => compileTemplate('${adjective*0}')).toThrow(/count/i);
	});

	it('throws on an inverted range', () => {
		expect(() => compileTemplate('${adjective*3-2}')).toThrow(/count/i);
	});
});

describe('renderTemplate', () => {
	it('weaves resolver results between the text nodes', () => {
		const nodes = compileTemplate('${username}, te ${adjective*2}!');
		const result = renderTemplate(nodes, slot =>
			slot.kind === 'username' ? 'Vendel' : `[${slot.kind}:${slot.min}-${slot.max}]`
		);
		expect(result).toBe('Vendel, te [adjective:2-2]!');
	});

	it('calls the resolver exactly once per slot node', () => {
		const nodes = compileTemplate('${adjective}, ${statement}, ${adjective*}');
		const seen = [];
		renderTemplate(nodes, slot => {
			seen.push(slot.kind);
			return 'x';
		});
		expect(seen).toEqual(['adjective', 'statement', 'adjective']);
	});
});
