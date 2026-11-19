/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Dictionary } from "./Dictionary";

const firstRef = beginCell().storeUint(0xab, 8).endCell();
const secondRef = beginCell().storeUint(0xcd, 8).endCell();

describe("Dictionary.Values.Slice", () => {
    it("serializes remaining bits and refs inline without advancing the value", () => {
        const value = beginCell()
            .storeUint(7, 3)
            .storeUint(0xa5, 8)
            .storeRef(firstRef)
            .storeRef(secondRef)
            .endCell()
            .beginParse();
        value.loadUint(3);
        value.loadRef();
        const builder = beginCell();
        Dictionary.Values.Slice().serialize(value, builder);
        const result = builder.endCell().beginParse();
        expect(result.loadUint(8)).toBe(0xa5);
        expect(result.loadRef()).toEqual(secondRef);
        result.endParse();
        expect(value.remainingBits).toBe(8);
        expect(value.remainingRefs).toBe(1);
    });

    it("parses an inline value from a hand-built one-bit dictionary leaf", () => {
        // hml_short: 0, unary length 1: 10, key: 1; then value: 101 + ref.
        const leaf = beginCell()
            .storeUint(0b0101, 4)
            .storeUint(0b101, 3)
            .storeRef(firstRef)
            .endCell();
        const dictionary = Dictionary.loadDirect(
            Dictionary.Keys.Uint(1),
            Dictionary.Values.Slice(),
            leaf,
        );
        const value = dictionary.get(1)!;
        expect(value.loadUint(3)).toBe(0b101);
        expect(value.loadRef()).toEqual(firstRef);
        value.endParse();
    });

    const payloads = [
        Cell.EMPTY,
        beginCell().storeUint(0b10101, 5).endCell(),
        beginCell()
            .storeRef(firstRef)
            .storeRef(secondRef)
            .storeRef(firstRef)
            .storeRef(secondRef)
            .endCell(),
        beginCell()
            .storeUint(0b101, 3)
            .storeRef(firstRef)
            .storeRef(secondRef)
            .endCell(),
    ];

    it.each(
        payloads,
    )("returns an independent slice and consumes its input: %#", (cell) => {
        const input = cell.beginParse();
        const value = Dictionary.Values.Slice().parse(input);
        input.endParse();
        expect(value).not.toBe(input);
        expect(value.asCell().equals(cell)).toBe(true);
    });

    it("round-trips heterogeneous inline values in a dictionary", () => {
        const values = Dictionary.Values.Slice();
        const keys = Dictionary.Keys.Uint(8);
        const dictionary = Dictionary.empty(keys, values);
        payloads.forEach((cell, key) => dictionary.set(key, cell.beginParse()));
        const encoded = beginCell().storeDict(dictionary).endCell();
        const decoded = encoded.beginParse().loadDict(keys, values);
        expect(decoded.size).toBe(payloads.length);
        payloads.forEach((cell, key) => {
            expect(decoded.get(key)!.asCell().equals(cell)).toBe(true);
        });
        expect(beginCell().storeDict(decoded).endCell().equals(encoded)).toBe(
            true,
        );
    });

    it("rejects a value that cannot fit inline alongside the leaf label", () => {
        const dictionary = Dictionary.empty(
            Dictionary.Keys.Uint(1),
            Dictionary.Values.Slice(),
        );
        dictionary.set(
            1,
            beginCell().storeUint(0, 1023).endCell().beginParse(),
        );
        expect(() => beginCell().storeDictDirect(dictionary)).toThrow(
            /overflow/i,
        );
    });
});
