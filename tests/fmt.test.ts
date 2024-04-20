import { describe, expect, it } from "vitest";
import { onlyNumbers, toBrl, toCellphone, toCnpj, toCpf, toSlugCase, trimAll } from "../src/strings/fmt";

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

    test("Should slugify strings", () => {
        expect(toSlugCase("é isso")).toBe("e-isso");
        expect(toSlugCase("Não tente isso aí")).toBe("nao-tente-isso-ai");
    });

    test("Should trim all spaces", () => {
        expect(trimAll("a                 a            ")).toBe("a a");
        expect(trimAll("a      \t           a  \s          ")).toBe("a a");
    });
});

