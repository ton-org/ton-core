/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Browsers and edge runtimes have no global `Buffer`. Bundlers resolve an explicit
// `import { Buffer } from "buffer"` to the `buffer` package, but leave a bare global
// reference undefined, which crashes at import time (e.g. `BitString.EMPTY`).
describe("no global Buffer", () => {
    const globalBuffer = globalThis.Buffer;

    beforeEach(() => {
        // `@ton/crypto` relies on the global `Buffer` too; that is out of scope here,
        // so back the hash it provides with Node's `crypto` to test this package alone.
        jest.doMock("@ton/crypto", () => ({
            ...jest.requireActual("@ton/crypto"),
            sha256_sync: (data: Uint8Array | string) =>
                require("crypto").createHash("sha256").update(data).digest(),
        }));
    });

    afterEach(() => {
        globalThis.Buffer = globalBuffer;
        jest.dontMock("@ton/crypto");
    });

    it("loads and round-trips a BoC without a global Buffer", () => {
        // @ts-ignore removing the global on purpose
        delete globalThis.Buffer;
        expect(typeof (globalThis as any).Buffer).toBe("undefined");

        jest.isolateModules(() => {
            const core = require("./index") as typeof import("./index");
            const addr = core.Address.parse(
                "EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y",
            );
            const cell = core
                .beginCell()
                .storeUint(0xdeadbeef, 32)
                .storeAddress(addr)
                .storeStringTail("hello")
                .endCell();
            const boc = cell.toBoc();
            const parsed = core.Cell.fromBoc(boc)[0];
            expect(parsed.hash().equals(cell.hash())).toBe(true);

            const s = parsed.beginParse();
            expect(s.loadUint(32)).toBe(0xdeadbeef);
            expect(s.loadAddress().equals(addr)).toBe(true);
            expect(s.loadStringTail()).toBe("hello");
        });
    });

    it("fails to parse a truncated BoC without a global Buffer", () => {
        // @ts-ignore removing the global on purpose
        delete globalThis.Buffer;

        jest.isolateModules(() => {
            const core = require("./index") as typeof import("./index");
            const boc = core.beginCell().storeUint(1, 8).endCell().toBoc();
            expect(() =>
                core.Cell.fromBoc(boc.subarray(0, boc.length - 2)),
            ).toThrow();
            expect(() =>
                core.Cell.fromBoc(boc.subarray(0, boc.length - 2)),
            ).not.toThrow(ReferenceError);
        });
    });
});
