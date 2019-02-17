import { onlyNumbers } from "../strings/Utils";

function isCreditCard(credit: string) {
	const string = onlyNumbers(credit);
	let sum = 0;
	for (let i = 0; i < string.length; i++) {
		let digit = Number.parseInt(string[string.length - i - 1]);
		if (i % 2 == 1) {
			digit *= 2;
		}
		sum += digit > 9 ? digit - 9 : digit;
	}
	return sum % 10 == 0;
}
