const splitWords = (value: string): string[] => {
    const separated = value.replace(/([\p{Ll}\p{N}])(\p{Lu})/gu, "$1 $2").replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, "$1 $2");
    return separated.match(/[\p{L}\p{M}\p{N}]+/gu) ?? [];
};

const capitalizeFirst = (value: string): string => {
    const codePoint = value.codePointAt(0);
    if (codePoint === undefined) return "";
    const first = String.fromCodePoint(codePoint);
    return first.toUpperCase() + value.slice(first.length);
};

export const camelCase = (value: string): string => {
    const words = splitWords(value);
    let result = "";
    for (let index = 0; index < words.length; index++) {
        const word = words[index]!.toLowerCase();
        result += index === 0 ? word : capitalizeFirst(word);
    }
    return result;
};

const joinLowercaseWords = (value: string, separator: string): string => {
    const words = splitWords(value);
    let result = "";
    for (let index = 0; index < words.length; index++) {
        if (index > 0) result += separator;
        result += words[index]!.toLowerCase();
    }
    return result;
};

export const snakeCase = (value: string): string => joinLowercaseWords(value, "_");
export const kebabCase = (value: string): string => joinLowercaseWords(value, "-");
