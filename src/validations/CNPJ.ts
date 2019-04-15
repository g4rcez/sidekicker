import { onlyNumbers } from "../strings/Utils";

const getChar = (str: string, position: number) => Number.parseInt(str.charAt(position), 10);

export function isCnpj(cnpj: string) {
	const val = onlyNumbers(cnpj);
	if (/0{14}/.test(val) || val.length != 14) {
		return false;
	}
	let length = val.length - 2;
	const digits = val.substring(length);
	let numbers = val.substring(0, length);
	let soma = 0;
	let position = length - 7;
	for (let i = length; i >= 1; i--) {
		soma += getChar(numbers, length - i) * position--;
		if (position < 2) {
			position = 9;
		}
	}
	let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado !== getChar(digits, 0)) {
		return false;
	}
	length = length + 1;
	numbers = val.substring(0, length);
	soma = 0;
	position = length - 7;
	for (let i = length; i >= 1; i--) {
		soma += getChar(numbers, length - i) * position--;
		if (position < 2) {
			position = 9;
		}
	}
	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	return resultado == getChar(digits, 1);
}
