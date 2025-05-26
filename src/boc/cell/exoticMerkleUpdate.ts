/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BitReader } from "../BitReader";
import { BitString } from "../BitString";
import { Cell } from "../Cell";
import { uint8ArrayToHexString, uint8ArrayEquals } from "../../utils/buffer_to_uint8array";

export function exoticMerkleUpdate(bits: BitString, refs: Cell[]) {
    const reader = new BitReader(bits);

    // type + hash + hash + depth + depth
    const size = 8 + (2 * (256 + 16));

    if (bits.length !== size) {
        throw new Error(`Merkle Update cell must have exactly (8 + (2 * (256 + 16))) bits, got "${bits.length}"`);
    }

    if (refs.length !== 2) {
        throw new Error(`Merkle Update cell must have exactly 2 refs, got "${refs.length}"`);
    }

    let type = reader.loadUint(8);
    if (type !== 4) {
        throw new Error(`Merkle Update cell type must be exactly 4, got "${type}"`)
    }

    const proofHash1 = reader.loadBuffer(32);
    const proofHash2 = reader.loadBuffer(32);
    const proofDepth1 = reader.loadUint(16);
    const proofDepth2 = reader.loadUint(16);

    if (proofDepth1 !== refs[0].depth(0)) {
        throw new Error(`Merkle Update cell ref depth must be exactly "${proofDepth1}", got "${refs[0].depth(0)}"`);
    }

    if (!uint8ArrayEquals(proofHash1, refs[0].hash(0))) {
        throw new Error(`Merkle Update cell ref hash must be exactly "${uint8ArrayToHexString(proofHash1)}", got "${uint8ArrayToHexString(refs[0].hash(0))}"`);
    }

    if (proofDepth2 !== refs[1].depth(0)) {
        throw new Error(`Merkle Update cell ref depth must be exactly "${proofDepth2}", got "${refs[1].depth(0)}"`);
    }

    if (!uint8ArrayEquals(proofHash2, refs[1].hash(0))) {
        throw new Error(`Merkle Update cell ref hash must be exactly "${uint8ArrayToHexString(proofHash2)}", got "${uint8ArrayToHexString(refs[1].hash(0))}"`);
    }

    return {
        proofDepth1,
        proofDepth2,
        proofHash1,
        proofHash2
    };
}
