import { describe, expect, it } from "vite-plus/test";
import { deepMerge, diff, equals, merge, omit, Objects, pick, setPath } from "../src";

describe("object utilities", () => {
    it("reads, checks, and lists object properties", () => {
        const value: { profile: { name: string; active: boolean }; tags: string[]; missing?: string } = {
            profile: { name: "Ada", active: false },
            tags: ["ts"],
        };

        expect(Objects.has(value, "profile")).toBe(true);
        expect(Objects.has(value, "missing")).toBe(false);
        expect(Objects.keys(value)).toEqual(["profile", "tags"]);
        expect(Objects.get(value, "profile.name")).toBe("Ada");
        expect(Objects.get(value, "profile.active")).toBe(false);
        expect(Objects.get(value, ["profile", "missing"], "fallback")).toBe("fallback");
        expect(Objects.get(value, "", "fallback")).toBeUndefined();
        expect(Objects.convertPath("profile.contacts[0].email")).toEqual(["profile", "contacts", "0", "email"]);
    });

    it("picks and omits typed own properties without mutating the source", () => {
        const marker = Symbol("marker");
        const source = { id: 7, name: "Ada", secret: "token", [marker]: "symbol" };
        const selected = pick(source, ["id", marker] as const);
        const publicFields = omit(source, ["secret"] as const);
        const selectedShape: Pick<typeof source, "id" | typeof marker> = selected;
        const publicShape: Omit<typeof source, "secret"> = publicFields;

        expect(selectedShape).toStrictEqual({ id: 7, [marker]: "symbol" });
        expect(publicShape).toStrictEqual({ id: 7, name: "Ada", [marker]: "symbol" });
        expect(source.secret).toBe("token");
        expect(Objects.pick(source, ["name"])).toStrictEqual({ name: "Ada" });
        expect(Objects.omit(source, ["id"])).toStrictEqual({ name: "Ada", secret: "token", [marker]: "symbol" });
    });

    it("does not copy inherited or non-enumerable object properties", () => {
        const source = Object.create({ inherited: 1 }) as { own: number; inherited: number };
        Object.defineProperty(source, "own", { enumerable: false, value: 2 });

        expect(pick(source, ["inherited", "own"])).toStrictEqual({});
        expect(omit(source, [])).toStrictEqual({});
    });

    it("copies an own __proto__ key without changing the result prototype", () => {
        const source = JSON.parse('{"__proto__":"kept","secret":"removed"}') as Record<string, string>;

        const selected = pick(source, ["__proto__"]);
        const omitted = omit(source, ["secret"]);

        expect(Object.getPrototypeOf(selected)).toBe(Object.prototype);
        expect(Object.hasOwn(selected, "__proto__")).toBe(true);
        expect(selected["__proto__"]).toBe("kept");
        expect(omitted["__proto__"]).toBe("kept");
        expect(Object.getPrototypeOf(omitted)).toBe(Object.prototype);
    });

    it("preserves falsy values and sparse path traversal", () => {
        const value = { zero: 0, flag: false, child: { label: "present" } };
        const sparsePath: string[] = [];
        sparsePath.length = 2;
        sparsePath[1] = "child";

        expect(Objects.get(value, ["zero", "next"], "fallback")).toBe(0);
        expect(Objects.get(value, "flag", "fallback")).toBe(false);
        expect(Objects.get(value, "child.missing", "fallback")).toBe("fallback");
        expect(Objects.get(value, "child.label", "fallback")).toBe("present");
        expect(Objects.get(value, sparsePath)).toBe(value.child);
        expect(Objects.get(value, [], "fallback")).toBe(value);
        expect(Objects.get({ field: null }, "field", "fallback")).toBeNull();
    });

    it("sets nested values on a clone without changing the source", () => {
        const source = { profile: { name: "Ada" }, label: "old" };
        const updated = setPath(source, "profile.name", "Grace");
        const nested = setPath(source, "label.child", "new");
        const arrayPath = setPath({}, ["items", 0, "name"], "value");

        expect(updated).toEqual({ profile: { name: "Grace" }, label: "old" });
        expect(source.profile.name).toBe("Ada");
        expect(nested).toEqual({ profile: { name: "Ada" }, label: { child: "new" } });
        expect(arrayPath).toEqual({ items: [{ name: "value" }] });
    });

    it("compares selected nested paths, including equal dates", () => {
        const first = { profile: { name: "Ada" }, createdAt: new Date(0) };
        const same = { profile: { name: "Ada" }, createdAt: new Date(0) };
        const changed = { profile: { name: "Grace" }, createdAt: new Date(0) };

        expect(equals(first, same)).toBe(true);
        expect(equals(first, changed)).toBe(false);
        expect(diff(first, same, ["profile.name", "createdAt"])).toBe(false);
        expect(diff(first, changed, ["profile.name"])).toBe(true);
        expect(diff(first, same, ["profile"])).toBe(false);
    });

    it("deep-merges missing defaults while preserving configured values", () => {
        const settings = { server: { host: "custom.example" } };
        const result = deepMerge({ enabled: true, server: { host: "localhost", port: 8080 } }, settings);

        expect(result).toEqual({ enabled: true, server: { host: "custom.example", port: 8080 } });
        expect(result).toBe(settings);
    });

    it("merges nested objects over a fresh result", () => {
        const target = { server: { retries: 1 }, legacy: "replace me" };
        const source = { server: { timeout: 30 }, legacy: { enabled: true }, feature: { enabled: true } };

        const result = merge(target, source);

        expect(result).toEqual({
            server: { retries: 1, timeout: 30 },
            legacy: { enabled: true },
            feature: { enabled: true },
        });
        expect(result).not.toBe(target);
        expect(target).toEqual({ server: { retries: 1 }, legacy: "replace me" });
    });
});
