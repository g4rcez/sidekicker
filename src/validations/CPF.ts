import { CPF } from "../regex/BrazilianRegex";
import { toInt, onlyNumbers } from "../strings/Utils";
import { equals } from "../comparable/Numbers";
import { CpfValidator } from "CpfValidator";
import generic from "./GenericValidator";
import { onlyChars } from "../regex/GenericRegex";

interface cpfFunctions {
    mask: Function;
    digit: Function;
    states: Function;
    [key: string]: Function;
}

const ufPerNinthDigit = [
    ["RS"],
    ["DF", "GO", "MT", "MS", "TO"],
    ["AM", "PA", "RR", "AP", "AC", "RO"],
    ["CE", "MA", "PI"],
    ["PB", "PE", "AL", "RN"],
    ["BA", "SE"],
    ["MG"],
    ["RJ", "ES"],
    ["SP"],
    ["PR", "SC"],
];

const cpfAlgo = (cpf: string) => {
    let numbers = "",
        digits = "",
        sum = 0,
        i = 0,
        result = 0,
        sames = 1;
    if (cpf.length < 11 || cpf === "00000000000") {
        return false;
    }
    for (i = 0; i < cpf.length - 1; i++) {
        if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            sames = 0;
            break;
        }
    }
    if (!sames) {
        numbers = cpf.substring(0, 9);
        digits = cpf.substring(9);
        sum = 0;
        for (i = 10; i > 1; i--) {
            sum += toInt(numbers.charAt(10 - i)) * i;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        if (!equals(result, digits.charAt(0))) {
            return false;
        }
        numbers = cpf.substring(0, 10);
        sum = 0;
        for (i = 11; i > 1; i--) {
            sum += toInt(numbers.charAt(11 - i)) * i;
        }
        result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
        return equals(result, digits.charAt(1));
    }
    return false;
};
const ninthDigit = (cpf: string) => onlyNumbers(cpf)[8];

const isCpf = (cpf: string, rules?: CpfValidator) => {
    const functions: cpfFunctions = {
        mask: (cpf: string) => !!CPF.test(cpf),
        digit: (cpf: string, digit: number) => equals(ninthDigit(cpf), digit),
        states: (cpf: string, states: string[]) => {
            const ninth = toInt(ninthDigit(cpf));
            const array: string[] = ufPerNinthDigit[ninth];
            for (let i = 0; i < states.length; i += 1) {
                if (array.includes(states[i])) {
                    return true;
                }
            }
            return false;
        },
    };
    if (onlyChars.test(cpf)) {
        return false;
    }
    return cpfAlgo(onlyNumbers(cpf)) && generic(rules, cpf, functions);
};

export default isCpf;
