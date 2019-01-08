import { Linq } from "../src/";

const list = Linq([
    { foo: "bar", id: 1, value: 500 },
    { foo: "bar", id: 2, value: 1050 },
    { foo: "bar", id: 2, value: 1050 },
    { foo: "bar", id: 2, value: 1050 },
    { foo: "bar", id: 2, value: 1050 },
    { foo: "bar", id: 3, value: 750 },
    { foo: "bar", id: 4, value: 501 },
    { foo: "bar", id: 4, value: 502 },
])
    .where({
        key: "value",
        operator: ">",
        value: 10,
    })
    .uniqBy("id")
    .reverse()
    .orderBy("value");
console.log(list.select());
