/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { crc16 } from "./crc16";
import { utf8StringToUint8Array, hexStringToUint8Array } from "./buffer_to_uint8array";

describe('crc16', () => {
    it('should match test vector', () => {
        expect(crc16(utf8StringToUint8Array('123456789'))).toEqual(hexStringToUint8Array('31c3'));
    });
});
