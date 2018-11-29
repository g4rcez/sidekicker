import moment from 'moment';
import { CEP } from '~Regex/BrazilianRegex';

export const cep = (text: string) => (CEP.test(text) ? text.trim().replace(CEP, '$1$2-$3') : text.trim());

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

export const epochToDate = (epoch: number, format = 'YYYY-MM-dd') => {
  return moment.unix(epoch).format(format);
};

export default {
  epochToDate,
  cpf,
  cep,
};
