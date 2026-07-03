import { describe, expect, it } from 'vitest';
import { getInsult } from './insults.js';
import insults from './insults.json' with { type: 'json' };

const RUNS = 300;
const KINDS = ['adjective', 'statement', 'goaway', 'intimidation'];
const LOWERCASE = 'a-záéíóöőúüű';

const keysWhere = (predicate) =>
	KINDS.flatMap(kind =>
		Object.keys(insults[kind]).filter(key => predicate(insults[kind][key])).map(key => key.trim())
	);

const generateMany = (gender, count = RUNS) =>
	Array.from({ length: count }, () => getInsult('Vendel', gender));

describe('getInsult', () => {
	it.each(['male', 'female', 'both'])('includes the name (%s)', (gender) => {
		const missing = generateMany(gender, 50).filter(insult => !insult.includes('Vendel'));
		expect(missing).toEqual([]);
	});

	it('starts with an uppercase letter and ends with ! or ?', () => {
		const badStart = new RegExp(`^[${LOWERCASE}]`);
		const broken = generateMany('both').filter(
			insult => badStart.test(insult) || !/[!?]$/.test(insult)
		);
		expect(broken).toEqual([]);
	});

	it('starts every sentence with an uppercase letter and has no comma after punctuation', () => {
		const badSentence = new RegExp(`[?!] [${LOWERCASE}]`);
		const broken = generateMany('both').filter(
			insult => badSentence.test(insult) || /[?!],/.test(insult)
		);
		expect(broken).toEqual([]);
	});

	it('leaves no stray commas or double spaces behind empty substitutions', () => {
		for (const gender of ['male', 'female', 'both']) {
			const broken = generateMany(gender, 500).filter(insult =>
				/,\s*[,!?]/.test(insult) || /\s{2}/.test(insult) || /^[,\s]/.test(insult) || /[\s,]$/.test(insult)
			);
			expect(broken).toEqual([]);
		}
	});

	it.each([
		['female', 'male'],
		['male', 'female'],
	])('never uses %s-excluded (%s-only) expressions', (gender, opposite) => {
		// Forbidden keys that appear as substrings of allowed keys would be false positives.
		const allowed = keysWhere(entry => entry.gender !== opposite);
		const forbidden = keysWhere(entry => entry.gender === opposite)
			.filter(key => allowed.every(other => !other.includes(key)));
		const violations = generateMany(gender).flatMap(insult =>
			forbidden.filter(key => insult.includes(key)).map(key => ({ key, insult }))
		);
		expect(violations).toEqual([]);
	});

	it('never threatens women (threat category)', () => {
		const threats = Object.keys(insults.intimidation)
			.filter(key => insults.intimidation[key].category === 'threat')
			.map(key => key.trim());
		const violations = generateMany('female').flatMap(insult =>
			threats.filter(threat => insult.includes(threat)).map(threat => ({ threat, insult }))
		);
		expect(violations).toEqual([]);
	});

	it('never repeats an expression within one insult', () => {
		const keys = keysWhere(() => true);
		// Keys contained in other keys would produce false positives when counting occurrences.
		const unambiguous = keys.filter(key =>
			keys.every(other => other === key || !other.includes(key))
		);
		const violations = generateMany('both').flatMap(insult =>
			unambiguous
				.filter(key => insult.split(key).length - 1 > 1)
				.map(key => ({ key, insult }))
		);
		expect(violations).toEqual([]);
	});
});
