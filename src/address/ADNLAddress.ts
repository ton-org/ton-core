/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import inspectSymbol from 'symbol.inspect';
import { base32Decode, base32Encode } from '../utils/base32';
import { crc16 } from '../utils/crc16';
import { base64ToUint8Array, uint8ArrayEquals, uint8ArrayToHexString } from '../utils/buffer_to_uint8array';

export class ADNLAddress {

    static parseFriendly(src: string) {

        if (src.length !== 55) {
            throw Error('Invalid address');
        }

        // Decoding
        src = 'f' + src;
        let decoded = base32Decode(src);
        if (decoded[0] !== 0x2d) {
            throw Error('Invalid address');
        }
        let gotHash = decoded.slice(33);
        let hash = crc16(decoded.slice(0, 33));
        if (!uint8ArrayEquals(hash, gotHash)) {
            throw Error('Invalid address');
        }
        return new ADNLAddress(decoded.slice(1, 33));
    }

    static parseRaw(src: string) {
        const data = base64ToUint8Array(src);
        return new ADNLAddress(data);
    }

    readonly address: Uint8Array;

    constructor(address: Uint8Array) {
        if (address.length !== 32) {
            throw Error('Invalid address');
        }
        this.address = address;
    }

    equals(b: ADNLAddress) {
        return uint8ArrayEquals(this.address, b.address);
    }

    toRaw = () => {
        return uint8ArrayToHexString(this.address).toUpperCase();
    }

    toString = () => {
        let data = new Uint8Array(1 + this.address.length);
        data[0] = 0x2D;
        data.set(this.address, 1);

        let hash = crc16(data);
        let result = new Uint8Array(data.length + hash.length);
        result.set(data);
        result.set(hash, data.length);

        return base32Encode(result).slice(1);
    }

    [inspectSymbol] = () => this.toString();
}
