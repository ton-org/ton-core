/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Prando from "prando";
import { Address } from "../address/Address";
import { ExternalAddress } from "../address/ExternalAddress";
import { bitsForNumber } from "./bitsForNumber";
import { uint8ArrayToHexString } from "./buffer_to_uint8array";

export function testAddress(workchain: number, seed: string) {
    const random = new Prando(seed);
    const hash = new Uint8Array(32);
    for (let i = 0; i < hash.length; i++) {
        hash[i] = random.nextInt(0, 255);
    }
    return new Address(workchain, hash);
}


export function testExternalAddress(seed: string) {
    const random = new Prando(seed);
    const hash = new Uint8Array(32);
    for (let i = 0; i < hash.length; i++) {
        hash[i] = random.nextInt(0, 255);
    }
    let v = BigInt('0x' + uint8ArrayToHexString(hash));
    return new ExternalAddress(v, bitsForNumber(v, 'uint'));
}
