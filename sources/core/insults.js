import shuffleArray from './utility/shuffle-array/index.js';
import { compileTemplate, renderTemplate } from './templating.js';
import insults from './insults.json' with { type: 'json' };

export const GENDERS = ['male', 'female', 'both'];

const COMPONENTS = Object.keys(insults).filter(key => key !== 'templates');

// Templates compile and validate at load time: an unknown placeholder fails fast.
const TEMPLATES = insults.templates.map((source, index) => {
	const nodes = compileTemplate(source);
	for (const node of nodes) {
		if (node.type === 'slot' && node.kind !== 'username' && !COMPONENTS.includes(node.kind)) {
			throw new Error(`Unknown placeholder in template #${index}: ${node.kind}`);
		}
	}
	return nodes;
});

const pickRandom = (items) => items[Math.floor(Math.random() * items.length)];

const capitalize = (text) => (text ? text[0].toUpperCase() + text.substring(1) : text);

// The insult inherits the category of a random intimidation; women are never threatened.
const pickCategory = (gender) => {
	let category;
	do {
		category = pickRandom(Object.values(insults.intimidation)).category;
	} while (gender === 'female' && category === 'threat');
	return category;
};

const polish = (text) => {
	// An exhausted expression pool leaves empty substitutions behind: stray commas, double spaces.
	const tidy = text
		.replace(/\s+/g, ' ')
		.replace(/ ,/g, ',')
		.replace(/,+/g, ',')
		.replace(/^[\s,]+/, '')
		.replace(/[\s,]+$/, '');
	const closed = tidy.replaceAll('?,', '?').replaceAll('!,', '!');
	return capitalize(`${closed}${/[?!]$/.test(closed) ? '' : '!'}`)
		.split('? ').map(capitalize).join('? ')
		.split('! ').map(capitalize).join('! ');
};

const getInsult = (username, gender) => {
	const template = pickRandom(TEMPLATES);
	const needsCategory = template.some(node => node.type === 'slot' && node.kind === 'intimidation');
	const category = needsCategory ? pickCategory(gender) : undefined;
	const used = new Set();

	const pickExpressions = (kind, count) => {
		const component = insults[kind];
		const picked = shuffleArray(Object.keys(component))
			.filter(key => !used.has(key)
				&& (component[key].gender === 'both' || component[key].gender === gender)
				&& (kind !== 'intimidation'
					|| component[key].category === 'general'
					|| component[key].category === category))
			.slice(0, count);
		picked.forEach(key => used.add(key));
		return picked.map(key => key.trim()).join(', ');
	};

	const filled = renderTemplate(template, ({ kind, min, max }) =>
		kind === 'username'
			? username
			: pickExpressions(kind, min + Math.floor(Math.random() * (max - min + 1)))
	);

	return polish(filled);
};

export { getInsult };
