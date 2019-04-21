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
	domain: (str: string, domain: string) => new RegExp(`@${domain}$`).test(str),
	namePattern: (str: string, pattern: string) => new RegExp(regExpEscape(`^${pattern}@`)).test(str),
	notIncludeChars: (str: string, rules: string) => {
		const notInclude = [...rules] || [];
		const errors = notInclude.filter((x) => str.search(x) === -1).filter(Boolean);
		return notInclude.length === errors.length;
	},
};

export function isEmail(str: string, rules?: EmailValidation) {
	const test = !!email.test(str);
	return test && generic(rules, str, functions);
}
