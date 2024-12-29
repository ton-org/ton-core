/**
 * Copyright (c) Whales Corp.
 * All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function toNano(
	src: number | string | bigint,
	decimals: number = 9
): bigint {
	if (typeof src === 'bigint') {
		return src * 10n ** BigInt(decimals);
	} else {
		if (typeof src === 'number') {
			if (!Number.isFinite(src)) {
				throw Error('Invalid number');
			}

			if (Math.log10(src) <= 6) {
				src = src.toLocaleString('en', {
					minimumFractionDigits: decimals,
					useGrouping: false,
				});
			} else if (src - Math.trunc(src) === 0) {
				src = src.toLocaleString('en', {
					maximumFractionDigits: 0,
					useGrouping: false,
				});
			} else {
				throw Error(
					'Not enough precision for a number value. Use string value instead'
				);
			}
		}
		// Check sign
		let neg = false;
		while (src.startsWith('-')) {
			neg = !neg;
			src = src.slice(1);
		}

		// Split string
		if (src === '.') {
			throw Error('Invalid number');
		}
		let parts = src.split('.');
		if (parts.length > 2) {
			throw Error('Invalid number');
		}

		// Prepare parts
		let whole = parts[0];
		let frac = parts[1];
		if (!whole) {
			whole = '0';
		}
		if (!frac) {
			frac = '0';
		}
		if (frac.length > decimals) {
			throw Error('Invalid number');
		}
		while (frac.length < decimals) {
			frac += '0';
		}

		// Convert
		let r = BigInt(whole) * 10n ** BigInt(decimals) + BigInt(frac);
		if (neg) {
			r = -r;
		}
		return r;
	}
}

export function fromNano(src: bigint | number | string, decimals: number = 9) {
	let v = BigInt(src);
	let neg = false;
	if (v < 0) {
		neg = true;
		v = -v;
	}

	// Convert fraction
	let frac = v % 10n ** BigInt(decimals);
	let facStr = frac.toString();
	while (facStr.length < decimals) {
		facStr = '0' + facStr;
	}
	facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)![1];

	// Convert whole
	let whole = v / 10n ** BigInt(decimals);
	let wholeStr = whole.toString();

	// Value
	let value = `${wholeStr}${facStr === '0' ? '' : `.${facStr}`}`;
	if (neg) {
		value = '-' + value;
	}

	return value;
}
