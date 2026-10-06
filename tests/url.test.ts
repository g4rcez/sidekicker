import { describe, expect, it } from "vite-plus/test";
import { joinPathname, queryStringFromUrl, toQueryString, trailingPaths } from "../src";

describe("URL utilities", () => {
    it("joins path segments without duplicate boundary slashes", () => {
        expect(trailingPaths("/api/users///")).toBe("/api/users");
        expect(joinPathname("https://example.test/api///", "/users/", "/7")).toBe("https://example.test/api/users/7");
    });

    it("preserves the base with no segments and handles empty segments", () => {
        const base = "https://example.test/api///";
        expect(joinPathname(base)).toBe(base);
        expect(joinPathname("root///", "")).toBe("root/");
        expect(joinPathname("root///", "/users///", "/7")).toBe("root/users/7");
    });

    it("round-trips nested values through query strings", () => {
        const value = { user: { name: "Ada" }, tags: ["typescript", "deno"] };
        const parsed = queryStringFromUrl(toQueryString(value));

        expect(parsed).toMatchObject(value);
    });
});
