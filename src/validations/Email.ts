import { email } from '../regex/WebRegex';
import regExpEscape from '../regex/RegExpEscape';

interface EmailValidation {
  domain?: string;
  notIncludeChars?: string;
  namePattern?: string;
}

const withoutDisallowed = (rules: string, string: string) => {
  const notPermittedArray = [...rules] || [];
  const errors = notPermittedArray.filter((x) => string.search(x) === -1).filter(Boolean);
  return notPermittedArray.length === errors.length;
};

const isEmail = (string: string, rules?: EmailValidation) => {
  const test = !!email.test(string);
  if (rules.domain && rules.notIncludeChars && rules.namePattern) {
    const testDomain = new RegExp(`${rules.domain}$`).test(string);
    const pattern = new RegExp(regExpEscape(`^${rules.namePattern}@`));
    const allowedTest = withoutDisallowed(rules.notIncludeChars, string);
    const patternTest = pattern.test(string);
    return test && allowedTest && patternTest && testDomain;
  }
  if (rules.notIncludeChars) {
    return test && withoutDisallowed(rules.notIncludeChars, string);
  }
  if (rules.domain) {
    const testDomain = new RegExp(`${rules.domain}$`).test(string);
    return test && testDomain;
  }
  if (rules.namePattern) {
    const pattern = new RegExp(regExpEscape(`^${rules.namePattern}@`));
    return test && pattern.test(string);
  }
  return test;
};

export default isEmail;
