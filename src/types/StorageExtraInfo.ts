/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

// Source: https://github.com/ton-blockchain/ton/blob/3fbab2c601380eba5ba68048f45d24a359bd2936/crypto/block/block.tlb#L250
// storage_extra_none$000 = StorageExtraInfo;
// storage_extra_info$001 dict_hash:uint256 = StorageExtraInfo;

export type StorageExtraInfo = {
    dictHash: bigint;
}

export function loadStorageExtraInfo(slice: Slice): StorageExtraInfo | null {
    let header = slice.loadUint(3);
    if (header === 0) {
        return null;
    }
    if (header === 1) {
        return {
            dictHash: slice.loadUintBig(256),
        };
    }
    throw new Error(`Invalid storage extra info header: ${header}`);
}

export function storeStorageExtraInfo(src: StorageExtraInfo | null) {
    return (builder: Builder) => {
        if (src === null || typeof src === 'undefined') {
            builder.storeUint(0, 3);
        } else {
            builder.storeUint(1, 3);
            builder.storeUint(src.dictHash, 256);
        }
    };
}
