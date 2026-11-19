/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from "./Address";

describe("Address", () => {
    const rawHash = "ab".repeat(32);
    it.each([
        "0",
        "-1",
        "-128",
        "127",
        "2147483647",
        "-2147483648",
        "00",
    ])("should validate and parse decimal raw workchain %s consistently", (workchain) => {
        const raw = `${workchain}:${rawHash.toUpperCase()}`;
        expect(Address.isRaw(raw)).toBe(true);
        expect(Address.parseRaw(raw).workChain).toBe(Number(workchain));
        expect(Address.parse(raw).hash.toString("hex")).toBe(rawHash);
    });
    it.each([
        "0x10",
        "1e1",
        "1.0",
        "-1.0",
        "+1",
        "-",
        "1junk",
        "Infinity",
        "NaN",
        "",
        " 1",
        "1 ",
        "1\n",
        "1\r",
        "9007199254740993",
    ])("should reject malformed raw workchain %j", (workchain) => {
        const raw = `${workchain}:${rawHash}`;
        expect(Address.isRaw(raw)).toBe(false);
        expect(() => Address.parseRaw(raw)).toThrow();
        expect(() => Address.parse(raw)).toThrow();
    });
    it.each([
        `0:${rawHash}:extra`,
        `0:${rawHash.slice(0, 63)}g`,
        `0:${rawHash.slice(0, 63)}`,
        `0:${rawHash}0`,
        `0:${rawHash}\n`,
        rawHash,
    ])("should reject malformed raw address %s", (raw) => {
        expect(Address.isRaw(raw)).toBe(false);
        expect(() => Address.parseRaw(raw)).toThrow();
        expect(() => Address.parse(raw)).toThrow();
    });
    it("should parse addresses in various forms", () => {
        let address1 = Address.parseFriendly(
            "0QAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4-QO",
        );
        let address2 = Address.parseFriendly(
            "kQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi47nL",
        );
        let address3 = Address.parseRaw(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        let address4 = Address.parse(
            "-1:3333333333333333333333333333333333333333333333333333333333333333",
        );
        expect(address1.isBounceable).toBe(false);
        expect(address2.isBounceable).toBe(true);
        expect(address1.isTestOnly).toBe(true);
        expect(address2.isTestOnly).toBe(true);
        expect(address1.address.workChain).toBe(0);
        expect(address2.address.workChain).toBe(0);
        expect(address3.workChain).toBe(0);
        expect(address1.address.hash).toEqual(
            Buffer.from(
                "2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
                "hex",
            ),
        );
        expect(address2.address.hash).toEqual(
            Buffer.from(
                "2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
                "hex",
            ),
        );
        expect(address3.hash).toEqual(
            Buffer.from(
                "2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
                "hex",
            ),
        );
        expect(address1.address.toRawString()).toBe(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        expect(address2.address.toRawString()).toBe(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        expect(address3.toRawString()).toBe(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        expect(address4.workChain).toBe(-1);
        expect(address4.hash).toEqual(
            Buffer.from(
                "3333333333333333333333333333333333333333333333333333333333333333",
                "hex",
            ),
        );
    });
    it("should serialize to friendly form", () => {
        let address = Address.parseRaw(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );

        // Bounceable
        expect(address.toString()).toMatch(
            "EQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4wJB",
        );
        expect(address.toString({ testOnly: true })).toMatch(
            "kQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi47nL",
        );
        expect(address.toString({ urlSafe: false })).toMatch(
            "EQAs9VlT6S776tq3unJcP5Ogsj+ELLunLXuOb1EKcOQi4wJB",
        );
        expect(address.toString({ urlSafe: false, testOnly: true })).toMatch(
            "kQAs9VlT6S776tq3unJcP5Ogsj+ELLunLXuOb1EKcOQi47nL",
        );

        // Non-Bounceable
        expect(address.toString({ bounceable: false })).toMatch(
            "UQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi41-E",
        );
        expect(address.toString({ bounceable: false, testOnly: true })).toMatch(
            "0QAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4-QO",
        );
        expect(address.toString({ bounceable: false, urlSafe: false })).toMatch(
            "UQAs9VlT6S776tq3unJcP5Ogsj+ELLunLXuOb1EKcOQi41+E",
        );
        expect(
            address.toString({
                bounceable: false,
                urlSafe: false,
                testOnly: true,
            }),
        ).toMatch("0QAs9VlT6S776tq3unJcP5Ogsj+ELLunLXuOb1EKcOQi4+QO");
    });
    it("should implement equals", () => {
        let address1 = Address.parseRaw(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        let address2 = Address.parseRaw(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        let address3 = Address.parseRaw(
            "-1:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e3",
        );
        let address4 = Address.parseRaw(
            "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e5",
        );
        expect(address1.equals(address2)).toBe(true);
        expect(address2.equals(address1)).toBe(true);
        expect(address2.equals(address4)).toBe(false);
        expect(address2.equals(address3)).toBe(false);
        expect(address4.equals(address3)).toBe(false);
    });

    it("should throw if address is invalid", () => {
        expect(() => {
            Address.parseRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422",
            );
        }).toThrowError("Invalid raw address");
        expect(
            Address.isRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422",
            ),
        ).toBe(false);

        expect(() => {
            Address.parseRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e",
            );
        }).toThrowError("Invalid raw address");
        expect(
            Address.isRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e",
            ),
        ).toBe(false);

        expect(() => {
            Address.parse(
                "ton://EQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4wJB",
            );
        }).toThrowError("Unknown address type");

        expect(() => {
            Address.parse("EQAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4wJ");
        }).toThrowError("Unknown address type");

        expect(() => {
            Address.parse(
                "ton://transfer/EQDXDCFLXgiTrjGSNVBuvKPZVYlPn3J_u96xxLas3_yoRWRk",
            );
        }).toThrowError("Unknown address type");

        expect(() => {
            Address.parseFriendly(
                "ton://transfer/EQDXDCFLXgiTrjGSNVBuvKPZVYlPn3J_u96xxLas3_yoRWRk",
            );
        }).toThrowError("Unknown address type");
        expect(
            Address.isFriendly(
                "ton://transfer/EQDXDCFLXgiTrjGSNVBuvKPZVYlPn3J_u96xxLas3_yoRWRk",
            ),
        ).toBe(false);

        expect(() => {
            Address.parseFriendly(
                "0:EQDXDCFLXgiTrjGSNVBuvKPZVYlPn3J_u96xxLas3_yoRWRk",
            );
        }).toThrowError("Unknown address type");
        expect(
            Address.isFriendly(
                "0:EQDXDCFLXgiTrjGSNVBuvKPZVYlPn3J_u96xxLas3_yoRWRk",
            ),
        ).toBe(false);

        expect(() => {
            Address.parseFriendly(
                "!@#$%^&*AAAAAAAAAAAAAA AAAAAAAAAA AAAAAAAAAAAA A",
            );
        }).toThrowError("Unknown address type");
        expect(
            Address.isFriendly(
                "!@#$%^&*AAAAAAAAAAAAAA AAAAAAAAAA AAAAAAAAAAAA A",
            ),
        ).toBe(false);

        expect(() => {
            Address.parseFriendly(
                "                                                ",
            );
        }).toThrowError("Unknown address type");
        expect(
            Address.isFriendly(
                "                                                ",
            ),
        ).toBe(false);
    });
});
