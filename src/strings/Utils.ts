interface ISeparator {
    text: string;
    separator: string;
}

interface IMask {
    text: string;
    pad: number;
    maskStr?: string;
}

interface IReplace {
    text: string;
    expr: string;
    new: string;
}

const adjacent = (any: any, direction: number) => {
    const str: string = any.toString();
    if (str.length === 0) {
        return "";
    }
    return `${str.slice(0, -1)} ${String.fromCharCode(str.charCodeAt(str.length - 1) + direction)}`;
};

const addChars = (total: number, pad: string) => {
    let concat = "";
    while (concat.length < total) {
        [...pad].forEach((x) => (concat += x));
    }
    return concat;
};

export function previousChar(string: string) {
    return adjacent(string, -1);
}

export function nextChar(string: string) {
    return adjacent(string, 1);
}

export function readableString(string: string) {
    return trueTrim(string)
        .replace(/([a-z\d])([A-Z]+)/g, "$1_$2")
        .replace(/[-\s]+/g, "_")
        .replace(/_/g, " ");
}

export function truncate(text: string, length: number, trunc: string, addTrunc: boolean = false) {
    const stringMaxLength = length - trunc.length;
    return addTrunc ? text.substr(0, length) + trunc : text.substr(0, stringMaxLength) + trunc;
}

export function leftPadding(text: string, total: number, pad: string) {
    return padding(text, total, pad, "left");
}

export function rightPadding(text: string, total: number, pad: string) {
    return padding(text, total, pad);
}

export function bothPadding(text: string, total: number, pad: string) {
    return padding(text, total, pad, "both");
}

export function padding(text: string, total: number, pad: string, side: string = "right") {
    if (text.length >= total) {
        return text;
    }
    const padLength = total - text.length;
    if (side === "left") {
        return addChars(padLength, pad) + text;
    } else if (side === "both") {
        const half = Math.ceil(padLength / 2);
        const padRepeat = addChars(half, pad);
        let padded = padRepeat + text + padRepeat;
        let whichSide = "right";
        while (padded.length > total) {
            if (whichSide === "right") {
                padded = padded.substr(0, padded.length - 1);
                whichSide = "left";
            } else {
                padded = padded.substr(1, padded.length);
                whichSide = "right";
            }
        }
        return padded;
    }
    return text + addChars(padLength, pad);
}

export function mask({ text, pad = text.length / 4, maskStr = "*" }: IMask) {
    return `${text}`.slice(-pad).padStart(`${text}`.length, maskStr);
}

export function reverse(string: string) {
    string.split("").reduce((r: string, c: string) => `${c}${r}`, "");
}

export function capitalize([char, ...chars]: string) {
    return char.toUpperCase() + chars.join("").toLowerCase();
}

export function titlelize(string: string, preserve: boolean = false) {
    const words = string.split(" ");
    const title = words.reduce((acc: string, curr: string) => {
        const first = curr.substring(0, 1).toUpperCase();
        const second = curr.substring(1);
        return preserve ? `${acc}${first}${second} ` : `${acc}${first}${second.toLowerCase()} `;
    }, "");
    return trueTrim(title);
}

export function replaceAll(replace: IReplace) {
    return replace.text.replace(new RegExp(replace.expr, "g"), replace.new);
}

export function brazilize(string: string) {
    return titlelize(string)
        .replace(" De ", " de ")
        .replace(" Da ", " da ")
        .replace(" Do ", " do ")
        .replace(" Dos ", " dos ")
        .replace(" Das ", " das ")
        .replace(" Um ", " um ")
        .replace(" Uns ", " uns ")
        .replace(" Del ", " del ");
}

export function camelize(string: string) {
    const s = string
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1).toLowerCase())
        .join("");
    return s.slice(0, 1).toLowerCase() + s.slice(1);
}

export function convert(doc: ISeparator) {
    return doc.text
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        .map((x) => x.toLowerCase())
        .join(doc.separator);
}

export function sneakize(text: string) {
    return convert({ separator: "_", text });
}

export function slugify(text: string) {
    return convert({ separator: "-", text });
}

export function trueTrim(string: string) {
    return string.trim().replace(/\s\s+/g, " ");
}

export function toInt(string: any) {
    return string >> 0;
}

export function toFloat(string: string | number) {
    return Number.parseFloat(`${string}`);
}

export function onlyNumbers(string: string) {
    return string.replace(/[^\d]/g, "");
}

export function onlyChars(string: string) {
    return string.replace(/[^a-záàãéèẽíìĩóòõúùũâêîôû]+/gi, "");
}

export const utils = {
    bothPadding,
    brazilize,
    camelize,
    capitalize,
    convert,
    leftPadding,
    mask,
    nextChar,
    onlyChars,
    onlyNumbers,
    padding,
    previousChar,
    readableString,
    replaceAll,
    reverse,
    rightPadding,
    slugify,
    sneakize,
    titlelize,
    toFloat,
    toInt,
    trueTrim,
    truncate,
};
