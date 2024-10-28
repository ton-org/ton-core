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
import { utf8StringToUint8Array } from '../../utils/buffer_to_uint8array';

function readBuffer(slice: Slice) {
    // Check consistency
    if (slice.remainingBits % 8 !== 0) {
        throw new Error(`Invalid string length: ${slice.remainingBits}`);
    }
    if (slice.remainingRefs !== 0 && slice.remainingRefs !== 1) {
        throw new Error(`invalid number of refs: ${slice.remainingRefs}`);
    }

    // Read string
    let res: Uint8Array
    if (slice.remainingBits === 0) {
        res = new Uint8Array(0);
    } else {
        res = slice.loadBuffer(slice.remainingBits / 8);
    }

    // Read tail
    if (slice.remainingRefs === 1) {
        const concatenatedBuffer = new Uint8Array(res.length + readBuffer(slice.loadRef().beginParse()).length);
        concatenatedBuffer.set(res, 0);
        concatenatedBuffer.set(readBuffer(slice.loadRef().beginParse()), res.length);
        res = concatenatedBuffer;
    }

    return res;
}

export function readString(slice: Slice) {
    return readBuffer(slice).toString();
}

function writeBuffer(src: Uint8Array, builder: Builder) {
    if (src.length > 0) {
        let bytes = Math.floor(builder.availableBits / 8);
        if (src.length > bytes) {
            let a = src.subarray(0, bytes);
            let t = src.subarray(bytes);
            builder = builder.storeBuffer(a);
            let bb = beginCell();
            writeBuffer(t, bb);
            builder = builder.storeRef(bb.endCell());
        } else {
            builder = builder.storeBuffer(src);
        }
    }
}

export function stringToCell(src: string): Cell {
    let builder = beginCell();
    writeBuffer(utf8StringToUint8Array(src), builder);
    return builder.endCell();
}

export function writeString(src: string, builder: Builder) {
    writeBuffer(utf8StringToUint8Array(src), builder);
}
