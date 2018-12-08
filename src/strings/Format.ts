import { CEP } from '../regex/BrazilianRegex';

export const cep = (text: string) => text.trim().replace(CEP, '$1$2-$3');

export const cpf = (string: string) => {
  return string
    .replace(/[^0-9]/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export const decimals = (target: string | number, places: number) => {
  return parseFloat(target.toString()).toFixed(places);
};

export default { cpf, cep };
