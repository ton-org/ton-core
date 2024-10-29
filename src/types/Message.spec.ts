/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { beginCell } from "../boc/Builder";
import { Cell } from "../boc/Cell";
import {loadMessage, storeMessage} from "./Message";

describe('Message', () => {
    it.skip('should handle edge case with extra currency', () => {
        const tx = 'te6cckEBBwEA3QADs2gB7ix8WDhQdzzFOCf6hmZ2Dzw2vFNtbavUArvbhXqqqmEAMpuMhx8zp7O3wqMokkuyFkklKpftc4Dh9_5bvavmCo-UXR6uVOIGMkCwAAAAAAC3GwLLUHl_4AYCAQCA_____________________________________________________________________________________gMBPAUEAwFDoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAUACAAAAAAAAAANoAAAAAEIDF-r-4Q';
        const cell = Cell.fromBase64(tx);
        const message = loadMessage(cell.beginParse());
        let stored = beginCell()
            .store(storeMessage(message))
            .endCell();
        expect(stored.equals(cell)).toBe(true);
    });
});
