import { onlyNumbers, toInt } from "../strings/Utils";

export default function isCreditCard(credit: string) {
	const str = onlyNumbers(credit);
	let sum = 0;
	for (let i = 0; i < str.length; i++) {
		let digit = toInt(str[str.length - i - 1]);
		if (i % 2 === 1) {
			digit *= 2;
		}
		sum += digit > 9 ? digit - 9 : digit;
	}
	return sum % 10 === 0;
}
