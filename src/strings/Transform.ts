interface Separator {
  text: string;
  separator: string;
}

interface Mask {
  text: string;
  pad: number;
  mask?: string;
}

interface Replace {
  text: string;
  expr: string;
  new: string;
}

const adjacent = (any: any, direction: number) => {
  const str = any.toString();
  if (str.length === 0) {
    return '';
  }
  return str.slice(0, -1) + String.fromCharCode(str.charCodeAt(str.length - 1) + direction);
};

const addChars = (total: number, pad: string) => {
  let concat = '';
  while (concat.length < total) {
    [...pad].forEach((x) => (concat += x));
  }
  return concat;
};

export const previousChar = (string: string) => {
  return adjacent(string, -1);
};

export const nextChar = (string: string) => {
  return adjacent(string, 1);
};

export const readable = (string: string) => {
  return trueTrim(string)
    .replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
    .replace(/[-\s]+/g, '_')
    .replace(/_id$/, '')
    .replace(/_/g, ' ');
};

export const truncate = (text: string, length: number, trunc: string, addTrunc: boolean = false) => {
  const stringMaxLength = length - trunc.length;
  if (addTrunc) {
    return text.substr(0, length) + trunc;
  }
  return text.substr(0, stringMaxLength) + trunc;
};

export const leftPadding = (text: string, total: number, pad: string) => padding(text, total, pad, 'left');

export const rightPadding = (text: string, total: number, pad: string) => padding(text, total, pad);

export const bothPadding = (text: string, total: number, pad: string) => padding(text, total, pad, 'both');

export const padding = (text: string, total: number, pad: string, side: string = 'right') => {
  if (text.length >= total) {
    return text;
  }
  const padLength = total - text.length;
  if (side === 'left') {
    return addChars(padLength, pad) + text;
  } else if (side === 'both') {
    const half = Math.ceil(padLength / 2);
    const padRepeat = addChars(half, pad);
    let padded = padRepeat + text + padRepeat;
    let whichSide = 'right';
    while (padded.length > total) {
      if (whichSide === 'right') {
        padded = padded.substr(0, padded.length - 1);
        whichSide = 'left';
      } else {
        padded = padded.substr(1, padded.length);
        whichSide = 'right';
      }
    }
    return padded;
  }
  return text + addChars(padLength, pad);
};

export const mask = ({ text, pad = 4, mask = '*' }: Mask) => `${text}`.slice(-pad).padStart(`${text}`.length, mask);

export const reverse = (string: string) => string.split('').reduce((rev: string, char: string) => `${char}${rev}`, '');

export const capitalize = ([char, ...chars]: string) => char.toUpperCase() + chars.join('').toLowerCase();

export const titlelize = (string: string, preserve: boolean = false) => {
  const words = string.split(' ');
  return words
    .reduce((acc: string, curr: string) => {
      const first = curr.substring(0, 1).toUpperCase();
      const second = curr.substring(1);
      return preserve ? `${acc}${first}${second} ` : `${acc}${first}${second.toLowerCase()} `;
    }, '')
    .trim();
};

export const replaceAll = (replace: Replace) => replace.text.replace(new RegExp(replace.expr, 'g'), replace.new);

export const brazilize = (string: string) => {
  return titlelize(string)
    .replace(' De ', ' de ')
    .replace(' Da ', ' da ')
    .replace(' Do ', ' do ')
    .replace(' Dos ', ' dos ')
    .replace(' Das ', ' das ')
    .replace(' Um ', ' um ')
    .replace(' Uns ', ' uns ')
    .replace(' Del ', ' del ');
};

export const camelize = (string: string) => {
  const s = string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
    .join('');
  return s.slice(0, 1).toLowerCase() + s.slice(1);
};

export const convert = (doc: Separator) => {
  return doc.text
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join(doc.separator);
};

export const sneakize = (text: string) => convert({ separator: '_', text });

export const slugify = (text: string) => convert({ separator: '-', text });

export const trueTrim = (string: string) => string.trim().replace(/\s\s+/g, ' ');

export const toInt = (string: any) => string >> 0;

export const onlyNumbers = (string: string) => string.replace(/[^0-9]/g, '');

export default {
  brazilize,
  slugify,
  toInt,
  sneakize,
  camelize,
  mask,
  reverse,
  replaceAll,
  capitalize: titlelize,
  padding,
  bothPadding,
  leftPadding,
  rightPadding,
  truncate,
  humanReadable: readable,
  trueTrim,
  nextChar,
  previousChar,
};
