/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

// Parsing helpers, kept free of React and cockpit so they can be unit tested in
// isolation.

// Extension of the file name at the end of a URL.
export function getFileExtension(url) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return filename.split('.').pop();
}

// Root filesystem partition from the `mount` output, mapped to its slot
// ("A" for partition 3, "B" for partition 4, null otherwise).
export function parseBootSlot(output) {
    const regex = /\/dev\/([^\s]+) on \/ /;
    const match = output.match(regex);
    if (!match) {
        return null;
    }
    const partMatch = match[1].match(/(\d+)$/);
    const partNumber = partMatch ? partMatch[1] : '';
    if (partNumber === '3') {
        return 'A';
    }
    if (partNumber === '4') {
        return 'B';
    }
    return null;
}

// Drop the SWUpdate banner from the tool output.
export function cleanSwupdateLog(output) {
    return output.replace(/SWUpdate v[\d.-]+[\s\S]*?Licensed under GPLv2[\s\S]*?(\n\n|$)/, '');
}
