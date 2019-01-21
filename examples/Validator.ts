import { Validator, ValidatorRules } from "../lib";
const person = {
    email: "ci@cla.no",
    name: "FooBar Lano",
};

const validating: ValidatorRules = {
    email: [["Good Name", (x: string, y: any) => y.name === "FooBar Lano"]],
    name: [["Good Name", (x: string) => x !== "FooBar Lano"]],
};

console.log(Validator(person, validating));
