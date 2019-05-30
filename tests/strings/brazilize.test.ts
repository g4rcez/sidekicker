import { brazilize } from "../../src/strings";

const arr = [
	{ toBe: "Fulano da Silva", expect: brazilize("Fulano Da Silva"), name: "Correct connectives" },
	{ toBe: "Ciclano Pereira", expect: brazilize("CICLANO PEREIRA"), name: "Normal capitalize" },
];

arr.forEach((testing) => {
	test(testing.name, () => {
		expect(testing.expect).toBe(testing.toBe);
	});
});
