import { email } from "../regex/WebRegex";
import regExpEscape from "../regex/RegExpEscape";
import generic from "./GenericValidator";
import { EmailValidation } from "../types/EmailValidation";

interface emailFunctions {
    domain: Function;
    notIncludeChars: Function;
    namePattern: Function;
    [key: string]: Function;
}

const functions: emailFunctions = {
    domain: (email: string, domain: string) => new RegExp(`@${domain}$`).test(email),
    notIncludeChars: (email: string, rules: string) => {
        const notInclude = [...rules] || [];
        const errors = notInclude.filter((x) => email.search(x) === -1).filter(Boolean);
        return notInclude.length === errors.length;
    },
    namePattern: (email: string, pattern: string) => new RegExp(regExpEscape(`^${pattern}@`)).test(email),
};

const Email = (string: string, rules?: EmailValidation) => {
    const test = !!email.test(string);
    return test && generic(rules, string, functions);
};

export default Email;
