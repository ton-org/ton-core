/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { crc32c } from "./crc32c";
import { utf8StringToUint8Array, hexStringToUint8Array } from "./buffer_to_uint8array";

describe('src32c', () => {
    it('should match test vector', () => {
        expect(crc32c(utf8StringToUint8Array('123456789'))).toEqual(hexStringToUint8Array('839206e3'));
    });
});
