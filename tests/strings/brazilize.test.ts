import { brazilize } from "../../src/strings";

const tests = [
    { toBe: "Fulano da Silva", expect: brazilize("Fulano Da Silva"), name: "Correct connectives" },
    { toBe: "Ciclano Pereira", expect: brazilize("CICLANO PEREIRA"), name: "Normal capitalize" },
];

tests.forEach((testing) => {
    test(testing.name, () => {
        expect(testing.expect).toBe(testing.toBe);
    });
});
