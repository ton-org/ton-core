import { Builder, beginCell } from '../boc/Builder';
import { Cell } from '../boc/Cell';
import { Slice } from '../boc/Slice';
import { Dictionary } from '../dict/Dictionary';

export type ExtraCurrency = {
    [k: number] : bigint
}

export function loadExtraCurrency(data: Slice | Cell | Dictionary<number, bigint>) {
    let ecDict = data instanceof Dictionary ? data : Dictionary.loadDirect(Dictionary.Keys.Uint(32), Dictionary.Values.BigVarUint(5), data);
    let ecMap: ExtraCurrency = {};

    for(let [k, v] of ecDict) {
       ecMap[k] = v;
    }

    return ecMap;
}

export function loadMaybeExtraCurrency(data: Slice) {
    const ecData = data.loadMaybeRef();
    return ecData === null ?  ecData : loadExtraCurrency(ecData);
}

export function storeExtraCurrency(extracurrency: ExtraCurrency) {
    return (builder: Builder) => {
        builder.storeDict(packExtraCurrencyDict(extracurrency));
    }
}

export function packExtraCurrencyDict(extracurrency: ExtraCurrency) {
    const resEc = Dictionary.empty(Dictionary.Keys.Uint(32), Dictionary.Values.BigVarUint(5));
    Object.entries(extracurrency).map(([k, v]) => resEc.set(Number(k), v));
    return resEc;
}

export function packExtraCurrencyCell(extracurrency: ExtraCurrency) {
    return beginCell().storeDictDirect(
        packExtraCurrencyDict(extracurrency)
    ).endCell();
}
