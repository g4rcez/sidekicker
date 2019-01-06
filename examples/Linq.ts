import { Linq } from "../src/";

const list = Linq([
    { foo: "bar", id: 1, value: 500 },
    { foo: "bar", id: 2, value: 1050 },
    { foo: "bar", id: 3, value: 750 },
    { foo: "bar", id: 4, value: 501 },
])
    .where({
        key: "id",
        value: (x: any) => x % 2 === 0,
    })
    .where({
        key: "value",
        operator: ">",
        value: 10,
    });

console.log(list.average("value"));
console.log(list.join([{ foo: "bar", id: 5, value: 700 }]).head())
