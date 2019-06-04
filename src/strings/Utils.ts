export interface ISeparator {
	text: string;
	separator: string;
}

export interface IMask {
	text: string;
	pad: number;
	maskStr?: string;
}

export interface IReplace {
	text: string;
	expr: string;
	new: string;
}

export const spreadString = (text: string) => text.split("");

const adjacent = (text: any, direction: number) => {
	const str: string = text.toString();
	if (str.length === 0) {
		return "";
	}
	return `${str.slice(0, -1)} ${String.fromCharCode(str.charCodeAt(str.length - 1) + direction)}`;
};

const addChars = (total: number, pad: string) => {
	let concat = "";
	while (concat.length < total) {
		spreadString(pad).forEach((x) => (concat += x));
	}
	return concat;
};

export function previousChar(str: string) {
	return adjacent(str, -1);
}

export function nextChar(str: string) {
	return adjacent(str, 1);
}

export function readableString(str: string) {
	return trueTrim(str)
		.replace(/([a-z\d])([A-Z]+)/g, "$1_$2")
		.replace(/[-\s]+/g, "_")
		.replace(/_/g, " ");
}

export function truncate(text: string, length: number, trunc: string, addTrunc = false) {
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

export function padding(text: string, total: number, pad: string, side = "right") {
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
	return `${text}${addChars(padLength, pad)}`;
}

export function mask({ text, pad = text.length / 4, maskStr = "*" }: IMask) {
	return `${text}`.slice(-pad).padStart(`${text}`.length, maskStr);
}

export function reverse(str: string) {
	str.split("").reduce((r: string, c: string) => `${c}${r}`, "");
}

export function capitalize(chars: string) {
	return (
		chars.charAt(0).toUpperCase() +
		spreadString(chars)
			.splice(1)
			.join("")
			.toLowerCase()
	);
}

export function titlelize(str: string, preserve = false) {
	const words = str.split(" ");
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

export function brazilize(str: string) {
	return titlelize(str)
		.replace(/ Da /g, " da ")
		.replace(/ De /g, " de ")
		.replace(/ Di /g, " di ")
		.replace(/ Do /g, " do ")
		.replace(/ Du /g, " du ")
		.replace(/ Das /g, " das ")
		.replace(/ Dos /g, " dos ")
		.replace(/ Um /g, " um ")
		.replace(/ Uns /g, " uns ")
		.replace(/ Del /g, " del ");
}

export function camelize(str: string) {
	const s = str
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

export function trueTrim(str: string) {
	return str.trim().replace(/\s\s+/g, " ");
}

export function toInt(str: any) {
	return str >> 0;
}

export function toFloat(str: string | number, exponent = 2) {
	return Number.parseFloat(Number.parseFloat(`${str}`).toExponential(exponent));
}

export function onlyNumbers(str: string) {
	return str.replace(/[^\d]/g, "");
}

export function onlyChars(str: string) {
	return str.replace(/[^a-záàãéèẽíìĩóòõúùũâêîôû]+/gi, "");
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
