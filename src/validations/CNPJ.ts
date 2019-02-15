import { onlyNumbers } from "../strings/Utils";

const reduceFunction = (index: number) => (buffer: number, number: number) => {
    buffer += number * index;
    index = index === 9 ? 2 : index + 1;
    return buffer;
};

const verifyingDigit = (numbers: string) => {
    const index = 2;
    const reverse = numbers.split("").reduce((buffer, number) => [+number].concat(buffer), []);
    const sum = reverse.reduce(reduceFunction(index), 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
};

export function isCnpj(cnpj: string) {
    const cleaned = onlyNumbers(cnpj);
    if (!cleaned || cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) {
        return false;
    }
    let registration = cleaned.substr(0, 12);
    registration += verifyingDigit(registration);
    registration += verifyingDigit(registration);
    return registration.substr(-2) === cleaned.substr(-2);
}
