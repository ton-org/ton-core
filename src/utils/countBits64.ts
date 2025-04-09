/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function countBits64(x: number): number {
  let count = 0;
  while (x) {
    count++;
    x &= (x - 1);
  }
  return count;
}
