/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell, Builder } from "../Builder";
import { Cell } from "../Cell";
import { Slice } from "../Slice";

function readBuffer(slice: Slice) {
    // Check consistency
    if (slice.remainingBits % 8 !== 0) {
        throw new Error(`Invalid string length: ${slice.remainingBits}`);
    }
    if (slice.remainingRefs !== 0 && slice.remainingRefs !== 1) {
        throw new Error(`invalid number of refs: ${slice.remainingRefs}`);
    }

    // Read string
    let res: Buffer
    if (slice.remainingBits === 0) {
        res = Buffer.alloc(0);
    } else {
        res = slice.loadBuffer(slice.remainingBits / 8);
    }

    // Read tail
    if (slice.remainingRefs === 1) {
        res = Buffer.concat([res, readBuffer(slice.loadRef().beginParse())]);
    }

    return res;
}

export function readString(slice: Slice) {
    return readBuffer(slice).toString();
}

function writeBuffer(src: Buffer, builder: Builder) {
    if (src.length === 0) {
        return;
    }

    const rootOffset = Math.floor(builder.availableBits / 8);
    builder.storeBuffer(src.subarray(0, rootOffset));

    const bytesPerCell = 127;
    const tailSize = Math.ceil((src.length - rootOffset) / bytesPerCell);
    let head: Cell | undefined;

    for (let i = tailSize - 1; i >= 0; i--) {
        const offset = rootOffset + i * bytesPerCell;
        const piece = src.subarray(offset, offset + bytesPerCell);
        const nextHead = beginCell().storeBuffer(piece);
        if (head) {
            nextHead.storeRef(head);
        }
        head = nextHead.endCell();
    }

    if (head) {
        builder.storeRef(head);
    }
}

export function stringToCell(src: string): Cell {
    let builder = beginCell();
    writeBuffer(Buffer.from(src), builder);
    return builder.endCell();
}

export function writeString(src: string, builder: Builder) {
    writeBuffer(Buffer.from(src), builder);
}