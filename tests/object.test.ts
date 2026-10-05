import { describe, expect, it } from "vite-plus/test";
import { deepMerge, diff, Objects, setPath } from "../src";

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

        expect(Objects.merge(target, source)).toEqual({
            server: { retries: 1, timeout: 30 },
            legacy: { enabled: true },
            feature: { enabled: true },
        });
        expect(target).toEqual({ server: { retries: 1 }, legacy: "replace me" });
    });
});
