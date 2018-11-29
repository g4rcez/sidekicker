import { CPF } from '../regex/BrazilianRegex';
import { toInt, onlyNumbers } from '../strings/Transform';
import { equals } from '../comparable/Numbers';

const ufPerNinthDigit = [
  ['RS'],
  ['DF', 'GO', 'MT', 'MS', 'TO'],
  ['AM', 'PA', 'RR', 'AP', 'AC', 'RO'],
  ['CE', 'MA', 'PI'],
  ['PB', 'PE', 'AL', 'RN'],
  ['BA', 'SE'],
  ['MG'],
  ['RJ', 'ES'],
  ['SP'],
  ['PR', 'SC'],
];

const cpfAlgo = (string: string) => {
  let numbers, digits, sum, i, result, sames;
  sames = 1;
  const cpf = onlyNumbers(string);
  if (cpf.length < 11 || cpf === '00000000000') {
    return false;
  }
  for (i = 0; i < cpf.length - 1; i++)
    if (cpf.charAt(i) != cpf.charAt(i + 1)) {
      sames = 0;
      break;
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
    return !equals(result, digits.charAt(1));
  }
  return false;
};

interface CpfValidator {
  states?: string[];
  digit?: number;
  validMask?: boolean;
}

const validateByUF = (cpf: string, states: string[]) => {
  const ninthDigit = toInt(cpf[8]);
  const array: string[] = ufPerNinthDigit[ninthDigit];
  for (let i = 0; i < states.length; i += 1) {
    if (array.includes(states[i])) {
      return true;
    }
  }
  return false;
};

const validateByDigit = (cpf: string, digit: number) => equals(cpf[8], digit);
const validateWithMask = (cpf: string) => !!CPF.test(cpf);

const isCpf = (cpf: string, rules?: CpfValidator) => {
  if (rules.digit && rules.validMask && rules.states) {
    const rulesTrue = validateByUF(cpf, rules.states) && validateByDigit(cpf, rules.digit) && validateWithMask(cpf);
    return cpfAlgo(cpf) && rulesTrue;
  } else if (rules.digit && rules.validMask) {
    const rulesTrue = validateByDigit(cpf, rules.digit) && validateWithMask(cpf);
    return rulesTrue && cpfAlgo(cpf);
  } else if (rules.digit && rules.states) {
    const rulesTrue = validateByUF(cpf, rules.states) && validateByDigit(cpf, rules.digit) && validateWithMask(cpf);
    return rulesTrue && cpfAlgo(cpf);
  } else if (rules.states && rules.validMask) {
    const rulesTrue = validateByUF(cpf, rules.states) && validateByDigit(cpf, rules.digit);
    return rulesTrue && cpfAlgo(cpf);
  } else if (rules.validMask) {
    return validateWithMask(cpf) && cpfAlgo(cpf);
  } else if (rules.states) {
    return validateByUF(cpf, rules.states) && cpfAlgo(cpf);
  }
  return cpfAlgo(cpf);
};

export default isCpf;
