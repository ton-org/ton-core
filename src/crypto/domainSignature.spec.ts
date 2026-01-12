import {
    getSecureRandomBytes,
    KeyPair,
    keyPairFromSeed,
    sign,
} from "@ton/crypto";
import { domainSign, domainSignVerify } from "./domainSignature";
import { SignatureDomain } from "../types/SignatureDomain";

describe("domainSignature", () => {
    const data = Buffer.from("Hello world!");
    let keypair: KeyPair;
    let targetSignature: Buffer;

    beforeAll(async () => {
        const seed = await getSecureRandomBytes(32);
        keypair = keyPairFromSeed(seed);
        targetSignature = sign(data, keypair.secretKey);
    });

    it("should not break on empty domain", () => {
        const newSignature = domainSign({ data, secretKey: keypair.secretKey });
        expect(newSignature.equals(targetSignature)).toBe(true);
        expect(
            domainSignVerify({
                data,
                signature: newSignature,
                publicKey: keypair.publicKey,
            }),
        ).toBe(true);
    });

    it("should work with a domain", () => {
        const globalId = 123;
        const domain: SignatureDomain = { type: "l2", globalId };

        const newSignature = domainSign({
            data,
            secretKey: keypair.secretKey,
            domain,
        });
        expect(newSignature.equals(targetSignature)).toBe(false);
        expect(
            domainSignVerify({
                data,
                signature: newSignature,
                publicKey: keypair.publicKey,
                domain,
            }),
        ).toBe(true);
        expect(
            domainSignVerify({
                data,
                signature: targetSignature,
                publicKey: keypair.publicKey,
                domain,
            }),
        ).toBe(false);
        expect(
            domainSignVerify({
                data,
                signature: newSignature,
                publicKey: keypair.publicKey,
            }),
        ).toBe(false);
        expect(
            domainSignVerify({
                data,
                signature: targetSignature,
                publicKey: keypair.publicKey,
            }),
        ).toBe(true);
    });

    it("should handle negative global ids", () => {
        const globalId = -6001;
        const domain: SignatureDomain = { type: "l2", globalId };

        const newSignature = domainSign({
            data,
            secretKey: keypair.secretKey,
            domain,
        });
        expect(newSignature.equals(targetSignature)).toBe(false);
        expect(
            domainSignVerify({
                data,
                signature: newSignature,
                publicKey: keypair.publicKey,
                domain,
            }),
        ).toBe(true);
    });
});
