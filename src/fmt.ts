export const onlyNumbers = (str: string) => str.replace(/[^0-9]/, "");

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

export const toCnpj = (str: string) => onlyNumbers(str).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

export const toBrl = (n: number) => Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
}).format(n).normalize("NFKD");

export const toFormattedNumber = (n: number) => Intl.NumberFormat("pt-BR", { style: "number" }).format(n).normalize("NFKD");


export const toSlugCase = (str: string) => str
    .replace(/^\s+|\s+$/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[·\/_,:;]/g, "-")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
