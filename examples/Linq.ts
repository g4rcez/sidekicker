import { Linq } from "../lib/iterable";

const list = Linq([
    { id: 1, value: 50 },
    { id: 2, value: 50 },
    { id: 3, value: 50 },
    { id: 4, value: 50 },
    { id: 5, value: 50 },
    { id: 6, value: 50 },
    { id: 7, value: 50 },
    { id: 8, value: 50 },
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
console.log(list.sum("value"));
