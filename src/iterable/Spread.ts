export default function Spread<T>(...props: T[]) {
	const length = props.length;
	if (length === 0) {
		return {};
	}
	if (length === 1) {
		return Object.assign({}, props);
	}
	let target = {};
	for (let i = 0; i !== length; i++) {
		target = Object.assign(target, props[i]);
	}
	return target;
}
