import { ValidatorRules } from "../lib/@types";
import { Validator } from "../lib/validations";
const person = {
    email: "ci@cla.no",
    name: "FooBar Lano",
};

const validating: ValidatorRules = {
    email: [["Equals", (x: string, y: any) => y.name === " FooBar Lano"]],
    name: [["Different", (x: string) => x !== "FooBar Lano"]],
};

console.log(Validator(person, validating));
