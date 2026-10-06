import { describe, expect, it } from "vite-plus/test";
import { camelCase, kebabCase, snakeCase } from "../src";

describe("string case utilities", () => {
    it("converts separated, camel-case, and acronym inputs", () => {
        expect(camelCase("hello world")).toBe("helloWorld");
        expect(camelCase("XMLHttpRequest")).toBe("xmlHttpRequest");
        expect(snakeCase("XMLHttpRequest")).toBe("xml_http_request");
        expect(kebabCase("hello_world")).toBe("hello-world");
        expect(kebabCase("user.profile-name")).toBe("user-profile-name");
    });

    it("preserves Unicode letters and handles empty input", () => {
        expect(camelCase("Déjà Vu")).toBe("déjàVu");
        expect(snakeCase("東京_駅")).toBe("東京_駅");
        expect(kebabCase("東京_駅")).toBe("東京-駅");
        expect(camelCase(" _--. ")).toBe("");
        expect(snakeCase("")).toBe("");
        expect(kebabCase(" ")).toBe("");
    });
});
