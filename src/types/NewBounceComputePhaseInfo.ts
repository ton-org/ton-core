// Follows [TEP-503](https://github.com/ton-blockchain/TEPs/pull/503/files)
// https://github.com/ton-blockchain/ton/blob/9f328c1d32b1ff826c0dd6d9934f5eb4dc606843/crypto/block/block.tlb#L167
// _ gas_used:uint32 vm_steps:uint32 = NewBounceComputePhaseInfo;

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

export type NewBounceComputePhaseInfo = {
    readonly gasUsed: number;
    readonly vmSteps: number;
}

export const loadNewBounceComputePhaseInfo = (slice: Slice): NewBounceComputePhaseInfo => {
    const gasUsed = slice.loadUint(32);
    const vmSteps = slice.loadUint(32);
    return {
        gasUsed,
        vmSteps,
    };
};

export const storeNewBounceComputePhaseInfo = (source: NewBounceComputePhaseInfo) => {
    return (builder: Builder): void => {
        builder.storeUint(source.gasUsed, 32);
        builder.storeUint(source.vmSteps, 32);
    };
};
