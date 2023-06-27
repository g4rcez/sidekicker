import { onlyNumbers, toBrl, toCellphone, toCnpj, toCpf } from "../src/fmt";
import { describe, expect, it } from "vitest";

const test = it.concurrent;

describe("Should test fmt functions", () => {
    test("Should show only numbers", () => {
        expect(onlyNumbers("13a")).toBe("13");

    });

    test("Should show formatted numbers", () => {
        expect(toCellphone("12345678")).toBe("1234-5678");
        expect(toCellphone("0012345678")).toBe("(00) 1234-5678");
        expect(toCellphone("912345678")).toBe("91234-5678");
        expect(toCellphone("99912345678")).toBe("(99) 91234-5678");
        expect(toCpf("12345678901")).toBe("123.456.789-01");
        expect(toCnpj("99102288555582")).toBe("99.102.288/5555-82");
        expect(toBrl(100)).toBe("R$ 100,00");
    });

});

