import { ValidatorRules } from "../lib/@types";
import { Validator } from "../lib";
const person = {
	email: "ci@cla.no",
	name: "FooBar Lano",
};

const validating: ValidatorRules = {
	email: [
		[
			"Equals",
			(x: string, y: any) => {
				return y.name === "FooBar Lano";
			},
		],
	],
	name: [["Different", (x: string) => x !== "FooBar Lano"], ["Equal", (x: string) => x === "FooBar Lano"]],
};

const ok = Validator(person, validating);
console.log(ok);
