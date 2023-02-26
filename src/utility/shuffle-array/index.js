
const shuffleArray = (array) => {
	const result = array.slice();
	const n = result.length, last = n - 1;
	for (let index = 0; index < n; index++) {
		const rand = index + Math.floor(Math.random() * (last - index + 1));
		const temp = result[index];
		result[index] = result[rand];
		result[rand] = temp;
	}
	return result;
}

module.exports = shuffleArray;
