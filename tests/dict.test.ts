import { describe, expect, it } from "vite-plus/test";
import { Dict } from "../src/dict";

describe("Dict", () => {
    const people = [
        { id: 1, name: "Ada", team: "compiler" },
        { id: 2, name: "Grace", team: "compiler" },
        { id: 3, name: "Linus", team: "kernel" },
    ];
    type Person = (typeof people)[number];

    it("constructs dictionaries from property and selector keys", () => {
        const byId = Dict.from("id", people, (person: Person) => person.name);
        const byName = Dict.from((person: Person) => person.name, people);

        expect(byId.get(1)).toBe("Ada");
        expect(byName.get("Grace")).toEqual(people[1]);
        expect(Dict.toArray(byId)).toEqual(["Ada", "Grace", "Linus"]);
    });

    it("groups by property or selector and serializes its values", () => {
        const byTeam = Dict.group("team", people);
        const byInitial = Dict.group((person: Person) => person.name[0]!, people);

        expect(byTeam.get("compiler")).toEqual(people.slice(0, 2));
        expect(byInitial.get("L")).toEqual([people[2]]);
        expect(JSON.stringify(byTeam)).toBe(JSON.stringify([people.slice(0, 2), [people[2]]]));
    });

    it("maps entries, removes keys, and clones without sharing map state", () => {
        const original = Dict.from("id", people, (person: Person) => person.name);
        const uppercased = original.map((name: string, id: number) => [id, name.toUpperCase()] as [number, string]);
        const clone = original.clone();

        expect(uppercased.get(1)).toBe("ADA");
        expect(original.remove(2)).toBe(original);
        expect(original.has(2)).toBe(false);
        expect(clone.has(2)).toBe(true);
        expect(clone.toJSON()).toEqual(["Ada", "Grace", "Linus"]);
    });
});
