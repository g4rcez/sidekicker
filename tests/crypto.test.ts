import crypto from "node:crypto";
import { describe, expect, test } from "vitest";
import { createCryptoModule } from "../src";

describe("Should test Crypto module", () => {
    const Crypto = createCryptoModule(crypto);
    test("Should encrypt and decrypt 'text'", async () => {
        const pair = await Crypto.generateRsaPair(new Uint8Array([1, 0, 1]));
        const publicKey = await Crypto.publicKey(pair.public);
        const encrypted = await Crypto.encrypt(publicKey, "text");
        const plainText = await Crypto.decrypt(pair.private, encrypted);
        expect(plainText).toBe("text")
    });
});