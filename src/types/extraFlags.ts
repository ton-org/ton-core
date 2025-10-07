/**
 * Follows [TEP-503](https://github.com/ton-blockchain/TEPs/pull/503/files)
 */

import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";

export type MessageFlags = {
    format: MessageFormat;
}

export type MessageFormat =
    | MessageFormatOld
    | MessageFormatNew

export type MessageFormatOld = {
    readonly type: "old";
}

export type MessageFormatNew = {
    readonly type: "new";
    readonly includeBody: boolean;
}

export const loadMessageFlags = (slice: Slice): MessageFlags => {
    const extraFlags = slice.loadCoins();
    if ((extraFlags & 1n) === 0n) {
        return {
            format: {
                type: "old"
            },
        };
    } else {
        return {
            format: {
                type: "new",
                includeBody: (extraFlags & 2n) !== 0n,
            },
        };
    }
};

export const storeMessageFlags = ({ format }: MessageFlags) => {
    return (builder: Builder): void => {
        if (format.type === 'old') {
            builder.storeCoins(0n);
        } else {
            builder.storeCoins(1n + (format.includeBody ? 2n : 0n));
        }
    };
};
