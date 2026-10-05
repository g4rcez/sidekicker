import { describe, expect, it } from "vite-plus/test";
import { removeDiacritics } from "../src";
import {
    normalize,
    number,
    onlyNumbers,
    pad,
    toBrl,
    toCellphone,
    toCnpj,
    toCpf,
    toFormattedNumber,
    toMoney,
    toSlugCase,
    trimAll,
} from "../src/strings/fmt";

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
    test("formats international phone numbers and decimal values", () => {
        expect(toCellphone("123456789012")).toBe("+12 34 5678-9012");
        expect(toCellphone("1234567890123")).toBe("+12 34 56789-0123");
        expect(toCellphone("not a number")).toBe("not a number");
        expect(number(1234.5, { locale: "en-US", style: "decimal", maximumFractionDigits: 1 })).toBe("1,234.5");
        expect(toMoney(12.5, undefined, "USD")).toBe(
            new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(12.5),
        );
        expect(toFormattedNumber(1234.5)).toBe(new Intl.NumberFormat(undefined, { style: "decimal" }).format(1234.5));
        expect(normalize("é")).toBe("e\u0301");
        expect(pad(9)).toBe("09");
        expect(pad(-123.9)).toBe("123");
    });

    test("normalizes mapped characters and preserves unknown symbols", () => {
        expect(removeDiacritics("Ǽ")).toBe("AE");
        expect(removeDiacritics("💫")).toBe("💫");
    });

    test("Should slugify strings", () => {
        expect(toSlugCase("é isso")).toBe("e-isso");
        expect(toSlugCase("Não tente isso aí")).toBe("nao-tente-isso-ai");
    });

    test("Should trim all spaces", () => {
        expect(trimAll("a                 a            ")).toBe("a a");
        expect(trimAll("a      \t           a  s          ")).toBe("a a s");
    });
});
