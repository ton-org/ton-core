// Follows [TEP-503](https://github.com/ton-blockchain/TEPs/pull/503/files)
// https://github.com/ton-blockchain/ton/blob/9f328c1d32b1ff826c0dd6d9934f5eb4dc606843/crypto/block/block.tlb#L166
// _ value:CurrencyCollection created_lt:uint64 created_at:uint32 = NewBounceOriginalInfo;

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { CurrencyCollection, loadCurrencyCollection, storeCurrencyCollection } from "./CurrencyCollection";

export type NewBounceOriginalInfo = {
    readonly value: CurrencyCollection;
    readonly createdLt: bigint;
    readonly createdAt: number;
}

export const loadNewBounceOriginalInfo = (slice: Slice): NewBounceOriginalInfo => {
    const value = loadCurrencyCollection(slice);
    const createdLt = slice.loadUintBig(64);
    const createdAt = slice.loadUint(32);
    return {
        value,
        createdLt,
        createdAt,
    };
};

export const storeNewBounceOriginalInfo = (source: NewBounceOriginalInfo) => {
    return (builder: Builder): void => {
        builder.store(storeCurrencyCollection(source.value));
        builder.storeUint(source.createdLt, 64);
        builder.storeUint(source.createdAt, 32);
    };
};
