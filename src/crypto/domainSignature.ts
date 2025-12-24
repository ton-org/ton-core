import { sha256_sync, sign, signVerify } from "@ton/crypto";
import {
    SignatureDomain,
    signatureDomainEmptyTag,
    signatureDomainL2Tag,
} from "../types/SignatureDomain";

export function signatureDomainHash(domain: SignatureDomain) {
    switch (domain.type) {
        case "empty":
            const tl = Buffer.alloc(4);
            tl.writeInt32LE(signatureDomainEmptyTag);
            return sha256_sync(tl);
        case "l2": {
            const tl = Buffer.alloc(8);
            tl.writeInt32LE(signatureDomainL2Tag);
            tl.writeInt32LE(domain.globalId);
            return sha256_sync(tl);
        }
        default:
            throw new Error(
                `Unknown SignatureDomain type ${(domain as SignatureDomain).type}`,
            );
    }
}

const signatureDomainEmptyHash = signatureDomainHash({ type: "empty" });

export function signatureDomainPrefix(
    domainOrHash: SignatureDomain | Buffer,
): Buffer | null {
    const domainHash = Buffer.isBuffer(domainOrHash)
        ? domainOrHash
        : signatureDomainHash(domainOrHash);

    if (domainHash.length !== 32) {
        throw new Error("Invalid signature domain hash length");
    }

    if (domainHash.equals(signatureDomainEmptyHash)) {
        return null;
    }

    return domainHash;
}

function domainDataToSign(data: Buffer, domain: SignatureDomain) {
    const prefix = signatureDomainPrefix(domain);
    return prefix ? Buffer.concat([prefix, data]) : data;
}

export function domainSign({
    data,
    secretKey,
    domain = { type: "empty" },
}: {
    data: Buffer;
    secretKey: Buffer;
    domain?: SignatureDomain;
}): Buffer {
    const dataToSign = domainDataToSign(data, domain);
    return sign(dataToSign, secretKey);
}

export function domainSignVerify({
    data,
    signature,
    publicKey,
    domain = { type: "empty" },
}: {
    data: Buffer;
    signature: Buffer;
    publicKey: Buffer;
    domain?: SignatureDomain;
}) {
    const dataToSign = domainDataToSign(data, domain);
    return signVerify(dataToSign, signature, publicKey);
}
