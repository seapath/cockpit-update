/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, expect, it } from 'vitest';
import { cleanSwupdateLog, getFileExtension, parseBootSlot } from '../../src/lib/updateParsing.js';

describe('getFileExtension', () => {
    it('returns the extension of the file in the URL', () => {
        expect(getFileExtension('https://example.com/fw/update.swu')).toBe('swu');
    });

    it('returns the whole string when there is no dot', () => {
        expect(getFileExtension('https://example.com/fwupdate')).toBe('fwupdate');
    });
});

describe('parseBootSlot', () => {
    it('maps partition 3 to slot A', () => {
        expect(parseBootSlot('/dev/mmcblk0p3 on / type ext4 (rw)\n')).toBe('A');
    });

    it('maps partition 4 to slot B', () => {
        expect(parseBootSlot('/dev/mmcblk0p4 on / type ext4 (rw)\n')).toBe('B');
    });

    it('returns null for any other partition', () => {
        expect(parseBootSlot('/dev/mmcblk0p5 on / type ext4 (rw)\n')).toBeNull();
    });

    it('handles multi-digit partition numbers', () => {
        expect(parseBootSlot('/dev/mmcblk0p13 on / type ext4 (rw)\n')).toBeNull();
    });

    it('returns null when the root filesystem is not a device', () => {
        expect(parseBootSlot('overlay on / type overlay (rw)\n')).toBeNull();
    });
});

describe('cleanSwupdateLog', () => {
    it('removes the SWUpdate banner', () => {
        const output = 'SWUpdate v2024.05\nsome lines\nLicensed under GPLv2\n\nStarting update\n';
        expect(cleanSwupdateLog(output)).toBe('Starting update\n');
    });

    it('leaves a regular log untouched', () => {
        expect(cleanSwupdateLog('Starting update\n')).toBe('Starting update\n');
    });
});
