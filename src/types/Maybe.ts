import { Builder } from "../boc/Builder";
import { Slice } from "../boc/Slice";
import { Maybe } from "../utils/maybe";

export const loadMaybe = <T>(loadChild: (slice: Slice) => T) => (slice: Slice): Maybe<T> => {
    const flag = slice.loadBit();
    if (flag) {
        return loadChild(slice);
    } else {
        return undefined;
    }
};

export const storeMaybe = <T>(
    storeChild: (source: T) => (builder: Builder) => void
) => (source: Maybe<T>) => (builder: Builder): void => {
    if (source === undefined || source === null) {
        builder.storeBit(false);
    } else {
        builder.storeBit(true);
        storeChild(source)(builder);
    }
};
