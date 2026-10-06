import { Is } from "./is";

export class Dict<K, V> extends Map<K, V> {
    public static from<
        Item,
        K extends keyof Item | ((k: Item) => string),
        Fn extends ((item: Item) => any) | undefined,
    >(key: K, list: Item[], fn?: Fn) {
        const get = Is.function(key) ? key : (item: Item) => (item as any)[key];
        type Key = K extends keyof Item ? Item[K] : string;
        type Value = Fn extends undefined ? Item : ReturnType<NonNullable<Fn>>;
        const result = new Dict<Key, Value>();
        const length = list.length;
        let hasHole = false;
        for (let index = 0; index < length; index++) {
            if (!(index in list)) {
                hasHole = true;
                continue;
            }
            const item = list[index] as Item;
            result.set(get(item) as Key, (fn ? fn(item) : item) as Value);
        }
        if (hasHole) throw new TypeError("Dictionary entries must be dense");
        return result;
    }

    public static toArray<K, V>(dict: Dict<K, V>) {
        return Array.from(dict.values());
    }

    public static group<T, K extends keyof T | ((k: T) => string)>(
        key: K,
        array: T[],
    ): Dict<K extends keyof T ? T[K] : string, T[]> {
        type GroupKey = K extends keyof T ? T[K] : string;
        const keyOf = Is.function(key) ? key : (item: T) => (item as any)[key];
        const dict = new Dict<GroupKey, T[]>();
        const length = array.length;
        for (let index = 0; index < length; index++) {
            if (!(index in array)) continue;
            const item = array[index] as T;
            const id = keyOf(item) as GroupKey;
            const group = dict.get(id);
            if (group === undefined) {
                dict.set(id, [item]);
                continue;
            }
            group.push(item);
        }
        return dict;
    }

    public toJSON() {
        return Dict.toArray(this);
    }

    public map<Fn extends (value: V, key: K) => [K, V]>(fn: Fn) {
        const a: Array<[K, V]> = [];
        this.forEach((value, key) => a.push(fn(value, key)));
        return new Dict(a);
    }

    public remove(id: K) {
        this.delete(id);
        return this;
    }

    public clone() {
        return new Dict(this);
    }
}
