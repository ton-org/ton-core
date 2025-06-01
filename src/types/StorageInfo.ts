/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { Maybe } from "../utils/maybe";
import { loadStorageExtraInfo, StorageExtraInfo, storeStorageExtraInfo } from './StorageExtraInfo';
import { loadStorageUsed, StorageUsed, storeStorageUsed } from "./StorageUsed"

// Source: https://github.com/ton-blockchain/ton/blob/3fbab2c601380eba5ba68048f45d24a359bd2936/crypto/block/block.tlb#L255
// storage_info$_ used:StorageUsed storage_extra:StorageExtraInfo last_paid:uint32
//   due_payment:(Maybe Grams) = StorageInfo;

export type StorageInfo = {
    used: StorageUsed;
    storageExtra: StorageExtraInfo | null;
    lastPaid: number;
    duePayment?: Maybe<bigint>;
}

export function loadStorageInfo(slice: Slice): StorageInfo {
    return {
        used: loadStorageUsed(slice),
        storageExtra: loadStorageExtraInfo(slice),
        lastPaid: slice.loadUint(32),
        duePayment: slice.loadMaybeCoins()
    };
}

export function storeStorageInfo(src: StorageInfo) {
    return (builder: Builder) => {
        builder.store(storeStorageUsed(src.used));
        builder.store(storeStorageExtraInfo(src.storageExtra));
        builder.storeUint(src.lastPaid, 32);
        builder.storeMaybeCoins(src.duePayment);
    };
}