/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Maybe } from "../utils/maybe";

type ExtraCurrencyMap = {
    [k: number]: bigint
}

export type ContractState = {
    balance: bigint,
    ec: Maybe<ExtraCurrencyMap>,
    last: { lt: bigint, hash: Buffer } | null,
    state: { type: 'uninit' } | { type: 'active', code: Maybe<Buffer>, data: Maybe<Buffer> } | { type: 'frozen', stateHash: Buffer }
};