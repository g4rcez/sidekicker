import { removeDiacritics } from "./diacritics";

export const onlyNumbers = (str: string) => str.replace(/[^0-9]/g, "");

export const toCellphone = (str: string) => {
    const phone = onlyNumbers(str);
    if (phone.length === 8) return phone.replace(/(\d{4})(\d{4})/, "$1-$2");
    if (phone.length === 9) return phone.replace(/(\d{5})(\d{4})/, "$1-$2");
    if (phone.length === 10) return phone.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    if (phone.length === 11) return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    if (phone.length === 13) return phone.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, "+$1 $2 $3-$4");
    if (phone.length === 14) return phone.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 $2 $3-$4");
    return str;
};

export const toCpf = (str: string) => onlyNumbers(str).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

export const toCnpj = (str: string) =>
    onlyNumbers(str).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

export const normalize = (str: string) => str.normalize("NFKD");

export const number = (n: number, options: Intl.NumberFormatOptions & { locale?: string }) =>
    normalize(Intl.NumberFormat(options.locale, { style: "currency", ...options }).format(n));

export const toMoney = (n: number, locale?: string, currency?: string) => number(n, { locale, currency });

export const toBrl = (n: number) => toMoney(n, "pt-BR", "BRL");

export const toFormattedNumber = (n: number) => number(n, { style: "decimal" });

export const toSlugCase = (str: string) =>
    removeDiacritics(str)
        .replace(/^\s+|\s+$/g, "")
        .toLowerCase()
        .replace(/[·\/_,:;]/g, "-")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

export const trimAll = (str: string) => str.replace(/[ \t\s]+/g, " ").trim();

export const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
