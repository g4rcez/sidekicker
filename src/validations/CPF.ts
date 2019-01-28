import { CpfValidator } from "CpfValidator";
import { equals } from "../comparable/Numbers";
import { REGEX_CPF } from "../regex/BrazilianRegex";
import { ONLY_CHARS } from "../regex/GenericRegex";
import { utils } from "../strings/Utils";
import generic from "./GenericValidator";

const { toInt, onlyNumbers } = utils;

interface ICpfFunctions {
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
  ["PR", "SC"]
];

const cpfAlgo = (cpf: string) => {
  let numbers = "";
  let digits = "";
  let sum = 0;
  let i = 0;
  let result = 0;
  let sames = 1;
  if (cpf.length < 11 || cpf === "00000000000") {
    return false;
  }
  for (i = 0; i < cpf.length - 1; i++) {
    if (cpf.charAt(i) !== cpf.charAt(i + 1)) {
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

export function isCpf(cpf: string, rules?: CpfValidator) {
  const functions: ICpfFunctions = {
    digit: (string: string, digit: number) => equals(ninthDigit(string), digit),
    mask: (string: string) => !!REGEX_CPF.test(string),
    states: (string: string, states: string[]) => {
      const ninth = toInt(ninthDigit(string));
      const array: string[] = ufPerNinthDigit[ninth];
      for (const state of states) {
        if (array.includes(state)) {
          return true;
        }
      }
      return false;
    }
  };
  if (ONLY_CHARS.test(cpf)) {
    return false;
  }
  return cpfAlgo(onlyNumbers(cpf)) && generic(rules, cpf, functions);
}
