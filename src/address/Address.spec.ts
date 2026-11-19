/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from "./Address";

describe("Address", () => {
    it.each([
        -128, -64, -2, -1, 0, 1, 127,
    ])("should preserve signed friendly workchain %i", (workChain) => {
        const address = new Address(workChain, Buffer.alloc(32, 0x42));
        for (const bounceable of [false, true]) {
            for (const testOnly of [false, true]) {
                const options = { bounceable, testOnly };
                expect(
                    Address.parse(address.toString(options)).equals(address),
                ).toBe(true);
                const parsed = Address.parseFriendly(
                    address.toStringBuffer(options),
                );
                expect(parsed.address.equals(address)).toBe(true);
                expect(parsed.isBounceable).toBe(bounceable);
                expect(parsed.isTestOnly).toBe(testOnly);
            }
        }
    });
    it("should decode a known workchain -2 friendly address", () => {
        const address = Address.parse(
            "Ef4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL3I",
        );
        expect(address.workChain).toBe(-2);
        expect(address.hash).toEqual(Buffer.alloc(32));
    });
    it("should still reject a negative-workchain address with an invalid checksum", () => {
        const encoded = new Address(-2, Buffer.alloc(32)).toStringBuffer();
        encoded[35] ^= 1;
        expect(() => Address.parseFriendly(encoded)).toThrow(
            "Invalid checksum",
        );
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
        }).toThrowError("Invalid address hash length: 31");
        expect(
            Address.isRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422",
            ),
        ).toBe(false);

        expect(() => {
            Address.parseRaw(
                "0:2cf55953e92efbeadab7ba725c3f93a0b23f842cbba72d7b8e6f510a70e422e",
            );
        }).toThrowError("Invalid address hash length: 31");
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
