/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Address } from "../../address/Address";
import { BitString } from "../../boc/BitString";
import { hexStringToUint8Array, uint8ArrayEquals } from "../../utils/buffer_to_uint8array";
import { testAddress } from "../../utils/testAddress";
import { deserializeInternalKey, serializeInternalKey } from "./internalKeySerializer";

describe('internalKeySerializer', () => {
    it('should serialize numbers', () => {
        let cs = [0, -1, 1, 123123123, -123123123];
        for (let c of cs) {
            expect(deserializeInternalKey(serializeInternalKey(c))).toBe(c);
        }
    });
    it('should serialize bignumbers', () => {
        let cs = [0n, -1n, 1n, 123123123n, -123123123n, 1231231231231237812683128376123n, -1231273612873681263871263871263n];
        for (let c of cs) {
            expect(deserializeInternalKey(serializeInternalKey(c))).toBe(c);
        }
    });
    it('should serialize addresses', () => {
        let cs = [testAddress(0, '1'), testAddress(-1, '1'), testAddress(0, '2'), testAddress(0, '4')];
        for (let c of cs) {
            expect((deserializeInternalKey(serializeInternalKey(c)) as Address).equals(c)).toBe(true);
        }
    });
    it('should serialize buffers', () => {
        let cs = [hexStringToUint8Array('00'), hexStringToUint8Array('ff'), hexStringToUint8Array('0f'), hexStringToUint8Array('0f000011002233456611')];
        for (let c of cs) {
            expect(uint8ArrayEquals(deserializeInternalKey(serializeInternalKey(c)) as Uint8Array, c)).toBe(true);
        }
    });
    it('should serialize bit strings', () => {
        let cs = [hexStringToUint8Array('00'), hexStringToUint8Array('ff'), hexStringToUint8Array('0f'), hexStringToUint8Array('0f000011002233456611')];
        for (let c of cs) {
            for(let i = 0; i < c.length * 8 - 1; i++) {
                let bs = new BitString(c, 0, c.length * 8 - i);
                const res = deserializeInternalKey(serializeInternalKey(bs)) as BitString;
                expect(res.equals(bs)).toBe(true);
            }
        }
    })
});
