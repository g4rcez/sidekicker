interface CryptoKeyHandle {
    readonly algorithm: { readonly name: string };
    readonly extractable: boolean;
    readonly type: string;
    readonly usages: readonly string[];
}

type CryptoProvider<Key extends CryptoKeyHandle> = {
    subtle: {
        importKey(
            format: "spki" | "pkcs8",
            keyData: ArrayBuffer,
            algorithm: { name: "RSA-OAEP"; hash: "SHA-256"; length: number },
            extractable: boolean,
            keyUsages: Array<"encrypt" | "decrypt">,
        ): Promise<Key>;
        generateKey(
            algorithm: {
                name: "RSA-OAEP";
                modulusLength: number;
                publicExponent: Uint8Array<ArrayBuffer>;
                hash: "SHA-256";
            },
            extractable: boolean,
            keyUsages: Array<"encrypt" | "decrypt">,
        ): Promise<{ privateKey: Key; publicKey: Key }>;
        exportKey(format: "spki" | "pkcs8", key: Key): Promise<ArrayBuffer>;
        encrypt(algorithm: { name: "RSA-OAEP" }, key: Key, data: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer>;
        decrypt(algorithm: { name: "RSA-OAEP" }, key: Key, data: Uint8Array<ArrayBuffer>): Promise<ArrayBuffer>;
    };
};

export const createCryptoModule = <Key extends CryptoKeyHandle>(crypto: CryptoProvider<Key>) => {
    const base64 = {
        decode: (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0)),
        encode: (b: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(b))),
    };

    const str2ab = (str: string) => {
        const buf = new ArrayBuffer(str.length);
        const bufView = new Uint8Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    };

    const binaryPem = (pem: string, type: string) => {
        const pemHeader = `-----BEGIN ${type} KEY-----`;
        const pemFooter = `-----END ${type} KEY-----`;
        const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length);
        const binaryDerString = atob(pemContents);
        return str2ab(binaryDerString);
    };

    const publicKey = async (publicKey: string) =>
        crypto.subtle.importKey(
            "spki",
            binaryPem(publicKey, "PUBLIC"),
            { name: "RSA-OAEP", hash: "SHA-256", length: 4096 },
            true,
            ["encrypt"],
        );

    const encrypt = async (cryptoKey: Key, text: string): Promise<string> => {
        const s = await crypto.subtle.encrypt({ name: "RSA-OAEP" }, cryptoKey, new TextEncoder().encode(text));
        return base64.encode(s);
    };

    const bufferToString = (buffer: ArrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]!);
        }
        return btoa(binary);
    };

    const generateRsaPair = async (exponent: Uint8Array<ArrayBuffer>) => {
        const pair = await crypto.subtle.generateKey(
            { name: "RSA-OAEP", modulusLength: 4096, publicExponent: exponent, hash: "SHA-256" },
            true,
            ["encrypt", "decrypt"],
        );
        const privateKey = bufferToString(await crypto.subtle.exportKey("pkcs8", pair.privateKey));
        const publicKey = bufferToString(await crypto.subtle.exportKey("spki", pair.publicKey));
        return {
            public: `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`,
            private: `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`,
        };
    };

    const privateKey = async (privateKey: string): Promise<Key> =>
        await crypto.subtle.importKey(
            "pkcs8",
            binaryPem(privateKey, "PRIVATE"),
            { name: "RSA-OAEP", hash: "SHA-256", length: 4096 },
            true,
            ["decrypt"],
        );

    const decryptText = async (privateKey: Key, target: string): Promise<string> => {
        const s = await crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, base64.decode(target));
        return atob(base64.encode(s));
    };

    const decrypt = async (secret: string, encryptedText: string) => {
        const importedPrivateKey = await privateKey(secret);
        return await decryptText(importedPrivateKey, encryptedText);
    };

    return { base64, binaryPem, publicKey, encrypt, str2ab, generateRsaPair, decrypt, privateKey };
};
