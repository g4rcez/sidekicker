import { trueTrim } from '../strings/Utils';

export const noHtml = (string: string) => {
  return trueTrim(string.replace(/<[^>]*>/g, ''));
};
