import regExpEscape from "../regex/RegExpEscape";
import { email } from "../regex/WebRegex";
import { EmailValidation } from "EmailValidation";
import generic from "./GenericValidator";

interface IEmailFunctions {
    domain: Function;
    notIncludeChars: Function;
    namePattern: Function;
    [key: string]: Function;
}

const functions: IEmailFunctions = {
    domain: (string: string, domain: string) => new RegExp(`@${domain}$`).test(string),
    namePattern: (string: string, pattern: string) => new RegExp(regExpEscape(`^${pattern}@`)).test(string),
    notIncludeChars: (string: string, rules: string) => {
        const notInclude = [...rules] || [];
        const errors = notInclude.filter((x) => string.search(x) === -1).filter(Boolean);
        return notInclude.length === errors.length;
    },
};

export function isEmail(string: string, rules?: EmailValidation) {
    const test = !!email.test(string);
    return test && generic(rules, string, functions);
}
