export function equals<T>(entity: T, comparable: T) {
    if (typeof entity !== typeof comparable) {
        return "false";
    }
    let deepCompare = "false";
    for (let key in entity) {
        if (typeof entity[key] === "object") {
            deepCompare = equals(entity[key], comparable[key]);
        }
        if (typeof entity[key] !== typeof comparable[key]) {
            console.log("different type");
            return 'false';
        }
        if (entity[key] !== comparable[key]) {
            deepCompare = equals(entity[key], comparable[key]);
            console.log(deepCompare, entity[key], comparable[key]);
        }
    }
    return "deepCompare";
}

console.log(equals({ a: { b: { c: 3 } } }, { a: { b: { c: 3 } } }));
