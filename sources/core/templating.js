// Miniature template engine for the insult templates.
//
// Syntax:
//   ${kind}       one expression from the `kind` component
//   ${kind*}      1–3 expressions
//   ${kind*2}     exactly 2 expressions
//   ${kind*2-4}   between 2 and 4 expressions
//
// Templates compile to an AST at load time (compileTemplate); expression
// selection belongs to the caller: renderTemplate asks the resolver for every slot.

const SLOT_PATTERN = /\$\{([a-z]+)(\*(?:\d+(?:-\d+)?)?)?\}/gi;

const parseCount = (suffix, token) => {
	if (suffix === undefined) return { min: 1, max: 1 };
	if (suffix === '*') return { min: 1, max: 3 };
	const [min, max = min] = suffix.slice(1).split('-').map(Number);
	if (min < 1 || max < min) {
		throw new Error(`Invalid count in placeholder ${token}`);
	}
	return { min, max };
};

export const compileTemplate = (source) => {
	const nodes = [];
	let cursor = 0;
	SLOT_PATTERN.lastIndex = 0;
	for (let match; (match = SLOT_PATTERN.exec(source)) !== null;) {
		const [token, kind, countSuffix] = match;
		if (match.index > cursor) {
			nodes.push({ type: 'text', value: source.slice(cursor, match.index) });
		}
		nodes.push({ type: 'slot', kind: kind.toLowerCase(), ...parseCount(countSuffix, token) });
		cursor = match.index + token.length;
	}
	if (cursor < source.length) {
		nodes.push({ type: 'text', value: source.slice(cursor) });
	}
	const garbage = nodes.find(node => node.type === 'text' && node.value.includes('${'));
	if (garbage) {
		throw new Error(`Unclosed or malformed placeholder in template: "${source}"`);
	}
	return nodes;
};

export const renderTemplate = (nodes, resolveSlot) =>
	nodes.map(node => (node.type === 'text' ? node.value : resolveSlot(node))).join('');
