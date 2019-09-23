import { REGEX_CEP } from "../regex/BrazilianRegex";
import { onlyNumbers, toFloat } from "./Utils";

export const formatCep = (cep: string) => cep.trim().replace(REGEX_CEP, "$1$2-$3");

export const formatCpf = (cpf: string) => onlyNumbers(cpf).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

export const formatCnpj = (cnpj: string) =>
	onlyNumbers(cnpj).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

export const formatDecimals = (target: string | number, places: number) => parseFloat(`${target}`).toFixed(places);

export const formatCardNumber = (str: string = "") => str.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4").trim();

export const formatPhoneCountryCode = (phone: string) =>
	onlyNumbers(phone).replace(/(\d\d)(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4");

export const formatPhoneDDD = (phone: string) => onlyNumbers(phone).replace(/(\d\d)(9\d{4})(\d{4})/, "($1) $2-$3");

export const formatCurrency = (value: number | string, intl = "pt-BR", currency = "BRL") =>
	new Intl.NumberFormat(intl, { style: "currency", currency }).format(toFloat(value)).replace(/\$/, "$ ");

export const formatCellPhone = (str: string = "") => str.replace(/(\d\d)(\d{5})(\d{4})/, "($1) $2-$3");

export const formatPhone = (phone: string) => {
	const str = onlyNumbers(phone);
	if (str.length === 8) {
		return str.replace(/(\d{4})(\d{4})/, "$1-$2");
	} else if (str.length === 9) {
		return str.replace(/(\d{5})(\d{4})/, "$1-$2");
	}
	return formatPhoneDDD(str);
};

export const formatBrlToFloat = (currency: string) => {
	const final = currency
		.replace(/,/g, ".")
		.replace(/(.*)\./, (x) => x.replace(/\./g, "") + ".")
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
