import { describe, expect, it } from "vite-plus/test";
import { formToJson } from "../src";

describe("formToJson", () => {
    it("parses nested fields and indexed values", () => {
        const form = new FormData();
        form.append("user.name", "Ada");
        form.append("roles[0]", "admin");
        form.append("roles[1]", "editor");

        expect(formToJson<{ user: { name: string }; roles: string[] }>(form)).toMatchObject({
            user: { name: "Ada" },
            roles: ["admin", "editor"],
        });
    });
});
