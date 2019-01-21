import { pluck } from "../src";

const arr = [
    { id: 1, num: Math.random() },
    { id: 2, num: Math.random() },
    { id: 3, num: Math.random() },
    { id: 4, num: Math.random() },
    { id: 5, num: Math.random() },
    { id: 6, num: Math.random() },
];

console.log(pluck(arr, "id", "num"));
console.log(pluck([], "id", "num"));
