/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import inspectSymbol from 'symbol.inspect';
import {BitString} from "../boc/BitString";

export class ExternalAddress {

    static isAddress(src: any): src is ExternalAddress {
        return src instanceof ExternalAddress;
    }

    readonly bits: BitString;

    constructor(bits: BitString) {
        this.bits = bits;
    }

    toString() {
        return `External<${this.bits}>`;
    }

    [inspectSymbol] = () => this.toString()
}