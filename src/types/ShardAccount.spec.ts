/**
 * Copyright (c) Whales Corp. 
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { inspect } from "util";
import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import { loadShardAccount, storeShardAccount } from "./ShardAccount";
import { base64ToUint8Array } from "../utils/buffer_to_uint8array";

describe('ShardAccount', () => {
    it('should parse tonkite cell', () => {
        const boc = base64ToUint8Array('te6cckEBBAEA7wABUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAnfACD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqCAkCIGAAAACAAAAAAAAAAGgN4Lazp2QAAE0ACAwCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjPUU3w=');
        const cell = Cell.fromBoc(boc)[0];
        const shardAccount = loadShardAccount(cell.beginParse());
        const stored = beginCell().store(storeShardAccount(shardAccount)).endCell();
        expect(cell.equals(stored)).toBe(true);
    });
});
