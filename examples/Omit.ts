import { omit } from "../lib/iterable";

const some = {
    age: 12,
    confirmedPassword: "#53cur171P455w0rD",
    foo: "Bar",
    name: "Foo",
    password: "#53cur171P455w0rD",
};

console.log(omit(some, "password", "confirmedPassword"));
console.log(omit([], "password", "confirmedPassword"));
