import { onlyChars } from "../../src/strings";

const tests = [
  { toBe: "aa", expect: onlyChars("a99a9"), name: "Chars between numbers" },
  { toBe: "a", expect: onlyChars("1a"), name: "Chars after numbers" }
];

tests.forEach((testing) => {
    test(testing.name, () => {
        expect(testing.expect).toBe(testing.toBe);
    });
});
