export default function concat<T>(toConcat: T[]) {
	return (targetArray: T[]) => {
		const arr = Array.from(targetArray);
		toConcat.forEach((x) => arr.push(x));
		return arr;
	};
}
