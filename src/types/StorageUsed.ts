/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

// Source: https://github.com/ton-blockchain/ton/blob/3fbab2c601380eba5ba68048f45d24a359bd2936/crypto/block/block.tlb#L253
// storage_used$_ cells:(VarUInteger 7) bits:(VarUInteger 7) = StorageUsed;

export type StorageUsed = {
    cells: bigint,
    bits: bigint,
};

export function loadStorageUsed(cs: Slice): StorageUsed {
    return {
        cells: cs.loadVarUintBig(3),
        bits: cs.loadVarUintBig(3),
    }
}

export function storeStorageUsed(src: StorageUsed) {
    return (builder: Builder) => {
        builder.storeVarUint(src.cells, 3);
        builder.storeVarUint(src.bits, 3);
    };
}