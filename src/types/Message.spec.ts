/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Address } from "../address/Address";
import { Dictionary } from "../dict/Dictionary";
import { SimpleLibraryValue } from "./SimpleLibrary";
import { loadMessage, storeMessage } from "./Message";
import { Message } from "./Message";

describe("Message", () => {
    it("should handle edge case with extra currency", () => {
        const tx =
            "te6cckEBBwEA3QADs2gB7ix8WDhQdzzFOCf6hmZ2Dzw2vFNtbavUArvbhXqqqmEAMpuMhx8zp7O3wqMokkuyFkklKpftc4Dh9_5bvavmCo-UXR6uVOIGMkCwAAAAAAC3GwLLUHl_4AYCAQCA_____________________________________________________________________________________gMBPAUEAwFDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAUACAAAAAAAAAANoAAAAAEIDF-r-4Q";
        const cell = Cell.fromBase64(tx);
        const message = loadMessage(cell.beginParse());
        let stored = beginCell().store(storeMessage(message)).endCell();
        expect(stored.equals(cell)).toBe(true);
    });

    it("should not overflow refs with extra currency + state init + body ref (#148)", () => {
        // Regression for #148: the state init is stored inline when there is
        // enough bit space, but inlining also copies its refs (code + data +
        // libraries) into the message cell. Together with the extra-currency
        // dict ref that already leaves no room for the body ref, so
        // storeMessage used to throw "Too many references". The init must fall
        // back to a ref when inlining it would not leave room for the body.
        const empty = Cell.EMPTY;
        const addr = Address.parse("0:" + "0".repeat(64));

        const extraCurrency = Dictionary.empty(
            Dictionary.Keys.Uint(32),
            Dictionary.Values.BigVarUint(32),
        );
        extraCurrency.set(1, 100n);

        const libraries = Dictionary.empty(
            Dictionary.Keys.BigUint(256),
            SimpleLibraryValue,
        );
        libraries.set(BigInt("0x" + empty.hash().toString("hex")), {
            public: false,
            root: empty,
        });

        const message: Message = {
            info: {
                type: "internal",
                ihrDisabled: true,
                bounce: true,
                bounced: false,
                src: addr,
                dest: addr,
                value: { coins: 0n, other: extraCurrency },
                ihrFee: 0n,
                forwardFee: 0n,
                createdLt: 0n,
                createdAt: 0,
            },
            init: { code: empty, data: empty, libraries },
            body: beginCell().storeRef(empty).endCell(),
        };

        const builder = beginCell();
        expect(() => storeMessage(message)(builder)).not.toThrow();

        // The produced cell must be structurally valid (a cell holds ≤ 4 refs).
        const stored = builder.endCell();
        expect(stored.refs.length).toBeLessThanOrEqual(4);

        // The init was pushed into a ref, the body kept its own ref.
        expect(stored.refs.length).toBeGreaterThan(0);
    });
});
