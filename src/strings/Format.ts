import { REGEX_CEP } from "../regex/BrazilianRegex";
import { onlyNumbers } from "./Utils";

export function formatCep(text: string) {
    return text.trim().replace(REGEX_CEP, "$1$2-$3");
}

export function formatCpf(string: string) {
    return onlyNumbers(string)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatDecimals(target: string | number, places: number) {
    return parseFloat(target.toString()).toFixed(places);
}

export function formatCardNumber(value: string) {
    return onlyNumbers(value)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
}

export function formatPhoneDDD(phone: string) {
    return onlyNumbers(phone).replace(/(\d\d)(9\d{4})(\d{4})/, "($1) $2-$3");
}

export function formatPhone(phone: string) {
    const string = onlyNumbers(phone);
    if (string.length === 8) {
        return string.replace(/(\d{4})(\d{4})/, "$1-$2");
    } else if (string.length === 9) {
        return string.replace(/(9\d{4})(\d{4})/, "$1-$2");
    }
    return formatPhoneDDD(string);
}

export const format = {
    formatCardNumber,
    formatCep,
    formatCpf,
    formatDecimals,
    formatPhone,
    formatPhoneDDD,
};
