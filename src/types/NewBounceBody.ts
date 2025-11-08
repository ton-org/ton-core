// https://github.com/ton-blockchain/ton/blob/9f328c1d32b1ff826c0dd6d9934f5eb4dc606843/crypto/block/block.tlb#L168
// new_bounce_body#fffffffe
//     original_body:^Cell
//     original_info:^NewBounceOriginalInfo
//     bounced_by_phase:uint8 exit_code:int32
//     compute_phase:(Maybe NewBounceComputePhaseInfo)
//     = NewBounceBody;

import { beginCell, Builder } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { Maybe } from "../utils/maybe";
import { loadMaybe, storeMaybe } from "./Maybe";
import { loadNewBounceComputePhaseInfo, NewBounceComputePhaseInfo, storeNewBounceComputePhaseInfo } from "./NewBounceComputePhaseInfo";
import { loadNewBounceOriginalInfo, NewBounceOriginalInfo, storeNewBounceOriginalInfo } from "./NewBounceOriginalInfo";

export type NewBounceBody = {
    readonly originalBody: Cell;
    readonly originalInfo: NewBounceOriginalInfo;
    readonly bouncedByPhase: number;
    readonly exitCode: number;
    readonly computePhase: Maybe<NewBounceComputePhaseInfo>;
}

const loadMaybeNewBounceComputePhaseInfo = loadMaybe(loadNewBounceComputePhaseInfo)

export const loadNewBounceBody = (slice: Slice): NewBounceBody => {
    const originalBody = slice.loadRef();
    const originalInfo = loadNewBounceOriginalInfo(slice.loadRef().asSlice());
    const bouncedByPhase = slice.loadUint(8);
    const exitCode = slice.loadInt(32);
    const computePhase = loadMaybeNewBounceComputePhaseInfo(slice);

    return {
        originalBody,
        originalInfo,
        bouncedByPhase,
        exitCode,
        computePhase,
    };
};

const storeMaybeNewBounceComputePhaseInfo = storeMaybe(storeNewBounceComputePhaseInfo);

export const storeNewBounceBody = (source: NewBounceBody) => {
    return (builder: Builder): void => {
        builder.storeRef(source.originalBody);
        builder.storeRef(
            beginCell()
                .store(storeNewBounceOriginalInfo(source.originalInfo))
                .endCell()
        );
        builder.storeUint(source.bouncedByPhase, 8);
        builder.storeInt(source.exitCode, 32);
        builder.store(storeMaybeNewBounceComputePhaseInfo(source.computePhase));
    };
};
