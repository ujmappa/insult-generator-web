const shuffleArray = require('./utility/shuffle-array');
const insults = require('./insults.json');

const getInsult = (username, gender) => {
	let templates = insults.templates, template = templates[Math.floor(Math.random()*templates.length)], category, alreadyUsed = [];
	if (template.search('intimidation') > -1) {
		let categories = Object.keys(insults.intimidation);
		while (category === undefined || (gender === 'female' && category === 'threat')) {
			let random = categories[Math.floor(Math.random()*categories.length)];
			category = insults.intimidation[random].category;
		}
	}
	let result = template.replace(/\$\{[a-z]+([\*])*\}/gi, (match, captured, offset) => {
		let matching = match.substring(2, match.length-(captured ? 2 : 1));
		if (matching === 'username') return username;
		let component = insults[matching];
		let candidates = shuffleArray(Object.keys(component));
		if (category === undefined) {
			category = component[candidates.pop()].category;
		}
		let expressions = [], expression, count = captured ? Math.floor(Math.random()*3) + 1 : 1;
		for (let i = 0; i < count; i++) {
			let found = false;
			while (!found && candidates.length) {
				expression = candidates.shift();
				if (matching === 'intimidation') {
					found = (component[expression].gender === 'both' || component[expression].gender === gender)
						&& (component[expression].category === 'general' || component[expression].category === category)
						&& (alreadyUsed.indexOf(expression) === -1);
				} else {
					found = (component[expression].gender === 'both' || component[expression].gender === gender)
						&& (alreadyUsed.indexOf(expression) === -1);
				}
			}
			if (found) {
				if (expression.search(/\?/) > -1) position = -1;
				expressions.push(expression.trim()), alreadyUsed.push(expression);
			}
		}
		let result = expressions.join(', ');
		return (offset === 0) ? result[0].toUpperCase() + result.substring(1).trim() : result.trim();
	});
	result = `${result.replace(/\?\,/gi, '?').replace(/\!\,/gi, '!')}${result.endsWith('?') || result.endsWith('!') ? '' : '!'}`;
	result = result.split('? ').map(sentence => sentence[0].toUpperCase() + sentence.substring(1)).join('? ');
	result = result.split('! ').map(sentence => sentence[0].toUpperCase() + sentence.substring(1)).join('! ');
	return result;
}

module.exports = { getInsult };
