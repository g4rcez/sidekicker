import { pluck } from "../lib/iterable";

const arr = [
    { id: 1, num: Math.random(), foo: "bar" },
    { id: 2, num: Math.random(), foo: "bar" },
    { id: 3, num: Math.random(), foo: "bar" },
    { id: 4, num: Math.random(), foo: "bar" },
    { id: 5, num: Math.random(), foo: "bar" },
    { id: 6, num: Math.random(), foo: "bar" },
];

console.log(pluck(arr, "id", "foo"));
console.log(pluck([], "id", "num"));
