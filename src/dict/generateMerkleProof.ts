import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { Slice } from "../boc/Slice";
import { DictionaryKeyTypes, Dictionary, DictionaryKey } from "./Dictionary";
import { readUnaryLength } from "./utils/readUnaryLength";
import { convertToMerkleProof } from "../boc/cell/exoticMerkleProof";

type MerkleProofKey = {
    bits: string;
    displayValue: string;
};

function throwMissingKey(key: MerkleProofKey): never {
    throw new Error(
        `Trying to generate merkle proof for a missing key "${key.displayValue}"`,
    );
}

function convertToPrunedBranch(c: Cell): Cell {
    return beginCell()
        .storeUint(1, 8)
        .storeUint(1, 8)
        .storeBuffer(c.hash(0))
        .storeUint(c.depth(0), 16)
        .endCell({ exotic: true });
}

function doGenerateMerkleProof(
    prefix: string,
    slice: Slice,
    n: number,
    keys: MerkleProofKey[],
): Cell {
    // Reading label
    const originalCell = slice.asCell();

    if (keys.length == 0) {
        // no keys to prove, prune the whole subdict
        return convertToPrunedBranch(originalCell);
    }

    let lb0 = slice.loadBit() ? 1 : 0;
    let prefixLength = 0;
    let pp = prefix;

    if (lb0 === 0) {
        // Short label detected

        // Read
        prefixLength = readUnaryLength(slice);

        // Read prefix
        for (let i = 0; i < prefixLength; i++) {
            pp += slice.loadBit() ? "1" : "0";
        }
    } else {
        let lb1 = slice.loadBit() ? 1 : 0;
        if (lb1 === 0) {
            // Long label detected
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += slice.loadBit() ? "1" : "0";
            }
        } else {
            // Same label detected
            let bit = slice.loadBit() ? "1" : "0";
            prefixLength = slice.loadUint(Math.ceil(Math.log2(n + 1)));
            for (let i = 0; i < prefixLength; i++) {
                pp += bit;
            }
        }
    }

    const missingKey = keys.find((key) => key.bits.slice(0, pp.length) !== pp);
    if (missingKey) {
        throwMissingKey(missingKey);
    }

    if (n - prefixLength === 0) {
        return originalCell;
    } else {
        let sl = originalCell.beginParse();
        let left = sl.loadRef();
        let right = sl.loadRef();
        // NOTE: Left and right branches are implicitly contain prefixes '0' and '1'
        const leftKeys = keys.filter((key) => {
            return pp + "0" === key.bits.slice(0, pp.length + 1);
        });
        if (!left.isExotic) {
            left = doGenerateMerkleProof(
                pp + "0",
                left.beginParse(),
                n - prefixLength - 1,
                leftKeys,
            );
        } else if (leftKeys.length > 0) {
            throwMissingKey(leftKeys[0]);
        }
        const rightKeys = keys.filter((key) => {
            return pp + "1" === key.bits.slice(0, pp.length + 1);
        });
        if (!right.isExotic) {
            right = doGenerateMerkleProof(
                pp + "1",
                right.beginParse(),
                n - prefixLength - 1,
                rightKeys,
            );
        } else if (rightKeys.length > 0) {
            throwMissingKey(rightKeys[0]);
        }

        return beginCell()
            .storeSlice(sl)
            .storeRef(left)
            .storeRef(right)
            .endCell();
    }
}

function serializeKeys<K extends DictionaryKeyTypes>(
    keys: K[],
    keyObject: DictionaryKey<K>,
): MerkleProofKey[] {
    return keys.map((key) => ({
        bits: keyObject
            .serialize(key)
            .toString(2)
            .padStart(keyObject.bits, "0"),
        displayValue: `${key}`,
    }));
}

/**
 * Generate a pruned dictionary directly from an already serialized dictionary
 * root. The result can be used as a part of a bigger merkle proof.
 *
 * Reusing the same root cell avoids serializing the whole dictionary for every
 * proof.
 *
 * @param root directly serialized dictionary root
 * @param keys an array of keys to prove
 * @param keyObject dictionary key serializer
 * @returns cell that contains the pruned dictionary
 */
export function generateMerkleProofDirectFromCell<K extends DictionaryKeyTypes>(
    root: Cell,
    keys: K[],
    keyObject: DictionaryKey<K>,
): Cell {
    return doGenerateMerkleProof(
        "",
        root.beginParse(),
        keyObject.bits,
        serializeKeys(keys, keyObject),
    );
}

/**
 * Generate a merkle proof from an already serialized dictionary root.
 *
 * Reusing the same root cell avoids serializing the whole dictionary for every
 * proof.
 *
 * @param root directly serialized dictionary root
 * @param keys an array of keys to prove
 * @param keyObject dictionary key serializer
 * @returns generated merkle proof cell
 */
export function generateMerkleProofFromCell<K extends DictionaryKeyTypes>(
    root: Cell,
    keys: K[],
    keyObject: DictionaryKey<K>,
): Cell {
    return convertToMerkleProof(
        generateMerkleProofDirectFromCell(root, keys, keyObject),
    );
}

export function generateMerkleProofDirect<K extends DictionaryKeyTypes, V>(
    dict: Dictionary<K, V>,
    keys: K[],
    keyObject: DictionaryKey<K>,
): Cell {
    keys.forEach((key) => {
        if (!dict.has(key)) {
            throw new Error(
                `Trying to generate merkle proof for a missing key "${key}"`,
            );
        }
    });
    const root = beginCell().storeDictDirect(dict).endCell();
    return generateMerkleProofDirectFromCell(root, keys, keyObject);
}

export function generateMerkleProof<K extends DictionaryKeyTypes, V>(
    dict: Dictionary<K, V>,
    keys: K[],
    keyObject: DictionaryKey<K>,
): Cell {
    return convertToMerkleProof(
        generateMerkleProofDirect(dict, keys, keyObject),
    );
}
