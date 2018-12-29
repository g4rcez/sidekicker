import { onlyNumbers } from "../../src/strings";

const tests = [
  { toBe: "999", expect: onlyNumbers("a99a9"), name: "Chars between numbers" },
  { toBe: "1", expect: onlyNumbers("1a"), name: "Chars after numbers" }
];

tests.forEach((testing) => {
    test(testing.name, () => {
        expect(testing.expect).toBe(testing.toBe);
    });
});
