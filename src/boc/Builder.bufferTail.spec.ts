/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell } from "./Builder";
import { Cell } from "./Cell";

describe("Builder.storeBufferTail", () => {
    it.each<[number, number]>([
        [0, 1],
        [1, 1],
        [126, 1],
        [127, 1],
        [128, 2],
        [254, 2],
        [255, 3],
        [256, 3],
        [1024, 9],
        [4096, 33],
    ])("stores %s bytes in %s cells", (length, expectedCells) => {
        const payload = Buffer.from(
            Array.from({ length }, (_, i) => (i * 37 + 19) % 256),
        );
        let cell = beginCell().storeBufferTail(payload).endCell();
        const chunks: Buffer[] = [];
        let cells = 0;
        while (true) {
            cells++;
            const slice = cell.beginParse();
            expect(slice.remainingBits % 8).toBe(0);
            expect(slice.remainingBits).toBeLessThanOrEqual(1016);
            expect(slice.remainingRefs).toBeLessThanOrEqual(1);
            chunks.push(slice.loadBuffer(slice.remainingBits / 8));
            if (slice.remainingRefs === 0) {
                break;
            }
            cell = slice.loadRef();
        }
        expect(Buffer.concat(chunks)).toEqual(payload);
        expect(cells).toBe(expectedCells);
    });

    it("preserves arbitrary bytes and supports builder chaining", () => {
        const payload = Buffer.from([0x00, 0xff, 0x80, 0xc0, 0x00, 0x01]);
        const builder = beginCell();
        expect(builder.storeBufferTail(payload)).toBe(builder);
        const slice = builder.endCell().beginParse();
        expect(slice.loadBuffer(6)).toEqual(payload);
        slice.endParse();
    });

    it("uses the remaining space after an existing byte prefix", () => {
        const payload = Buffer.from(Array.from({ length: 128 }, (_, i) => i));
        const cell = beginCell()
            .storeUint(0xab, 8)
            .storeBufferTail(payload)
            .endCell();
        const slice = cell.beginParse();
        expect(slice.loadUint(8)).toBe(0xab);
        expect(slice.loadBuffer(126)).toEqual(payload.subarray(0, 126));
        const tail = slice.loadRef().beginParse();
        expect(tail.loadBuffer(2)).toEqual(payload.subarray(126));
        slice.endParse();
        tail.endParse();
    });

    it("preserves existing references before the continuation", () => {
        const marker = beginCell().storeUint(0xab, 8).endCell();
        const payload = Buffer.alloc(128, 0xff);
        const cell = beginCell()
            .storeRef(marker)
            .storeBufferTail(payload)
            .endCell();
        expect(cell.refs).toHaveLength(2);
        expect(cell.refs[0]).toEqual(marker);
        expect(cell.refs[1].beginParse().loadBuffer(1)).toEqual(
            Buffer.from([0xff]),
        );
    });

    it("leaves a full builder unchanged for an empty buffer", () => {
        const builder = beginCell().storeUint(0, 1023);
        for (let i = 0; i < 4; i++) {
            builder.storeRef(Cell.EMPTY);
        }
        const before = builder.endCell().toBoc().toString("hex");
        builder.storeBufferTail(Buffer.alloc(0));
        expect(builder.endCell().toBoc().toString("hex")).toBe(before);
    });

    it("rejects a continuation when no reference slots remain", () => {
        const builder = beginCell();
        for (let i = 0; i < 4; i++) {
            builder.storeRef(Cell.EMPTY);
        }
        expect(() => builder.storeBufferTail(Buffer.alloc(128))).toThrow(
            "Too many references",
        );
    });

    it("copies the supplied bytes instead of retaining mutable input", () => {
        const payload = Buffer.from([0x00, 0xff, 0x80]);
        const cell = beginCell().storeBufferTail(payload).endCell();
        payload.fill(0);
        expect(cell.beginParse().loadBuffer(3)).toEqual(
            Buffer.from([0x00, 0xff, 0x80]),
        );
    });
});
