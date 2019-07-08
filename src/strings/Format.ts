import { REGEX_CEP } from "../regex/BrazilianRegex";
import { onlyNumbers } from "./Utils";

export function formatCep(cep: string) {
	return cep.trim().replace(REGEX_CEP, "$1$2-$3");
}

export function formatCpf(cpf: string) {
	return onlyNumbers(cpf).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export function formatCnpj(cnpj: string) {
	return onlyNumbers(cnpj).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

export function formatDecimals(target: string | number, places: number) {
	return parseFloat(`${target}`).toFixed(places);
}

export function formatCardNumber(str?: string) {
	return !!str ? str.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4").trim() : "";
}

export function formatPhoneCountryCode(phone: string) {
	return onlyNumbers(phone).replace(/(\d\d)(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4");
}

export function formatPhoneDDD(phone: string) {
	return onlyNumbers(phone).replace(/(\d\d)(9\d{4})(\d{4})/, "($1) $2-$3");
}

export function formatCurrency(value: number, intl = "pt-BR", currency = "BRL") {
	return new Intl.NumberFormat(intl, { style: "currency", currency }).format(value).replace(/\$/, "$ ");
}

export function formatCellPhone(str?: string) {
	return str ? str.replace(/(\d\d)(\d{5})(\d{4})/, "($1) $2-$3") : "";
}

export function formatPhone(phone: string) {
	const str = onlyNumbers(phone);
	if (str.length === 8) {
		return str.replace(/(\d{4})(\d{4})/, "$1-$2");
	} else if (str.length === 9) {
		return str.replace(/(\d{5})(\d{4})/, "$1-$2");
	}
	return formatPhoneDDD(str);
}

export const formatBrlToFloat = (currency: string) => {
	const final = currency
		.replace(/\./g, "")
		.replace(/,/g, ".")
		.replace(/[^0-9\.]/g, "");
	return Number.parseFloat(final);
};

export const formatPaymentTicketBR = (ticket: string) =>
	onlyNumbers(ticket).replace(/^(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d)(\d{14})$/, "$1.$2 $3.$4 $5.$6 $7 $8");

export const format = {
	formatCpf,
	formatCep,
	formatCnpj,
	formatPhone,
	formatCurrency,
	formatDecimals,
	formatPhoneDDD,
	formatCellPhone,
	formatCardNumber,
	formatBrlToFloat,
	formatPhoneCountryCode,
};
