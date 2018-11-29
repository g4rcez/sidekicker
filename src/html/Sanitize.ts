import { trueTrim } from './../strings/Transform';

export const noHtml = (string: string) => {
  return trueTrim(string.replace(/<[^>]*>/g, ''));
};
