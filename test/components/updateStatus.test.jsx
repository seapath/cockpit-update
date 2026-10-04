/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UpdateStatus from '../../src/components/updateStatus.jsx';
import { respond } from '../helpers/spawn.js';

const MOUNT_A = '/dev/mmcblk0p3 on / type ext4 (rw)\n';
const MOUNT_B = '/dev/mmcblk0p4 on / type ext4 (rw)\n';
const MOUNT_OTHER = '/dev/mmcblk0p1 on / type ext4 (rw)\n';

function renderStatus() {
    const ref = React.createRef();
    render(<UpdateStatus ref={ref} />);
    return ref;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('UpdateStatus', () => {
    it('detects slot A and a successful update', async () => {
        respond({ 'ls /var/log/update_success': '/var/log/update_success\n', mount: MOUNT_A });
        const ref = renderStatus();

        await waitFor(() => expect(ref.current.state.status).toBe('success'));
        expect(ref.current.state.slotA).toBe(true);
        expect(screen.getByText(/Slot A/)).toBeInTheDocument();
    });

    it('detects slot B and a failed update', async () => {
        respond({ 'ls /var/log/update_fail': '/var/log/update_fail\n', mount: MOUNT_B });
        const ref = renderStatus();

        await waitFor(() => expect(ref.current.state.status).toBe('fail'));
        expect(ref.current.state.slotB).toBe(true);
        expect(screen.getByText(/Slot B/)).toBeInTheDocument();
    });

    it('detects an update waiting for a reboot', async () => {
        respond({ 'ls /var/log/update_marker': '/var/log/update_marker\n', mount: MOUNT_A });
        const ref = renderStatus();

        await waitFor(() => expect(ref.current.state.status).toBe('wait for reboot'));
    });

    it('keeps the slot unknown for another partition', async () => {
        respond({ mount: MOUNT_OTHER });
        const ref = renderStatus();

        await waitFor(() => expect(ref.current.state.slotA).toBe(false));
        expect(ref.current.state.slotB).toBe(false);
        expect(screen.getByText(/Unknown/)).toBeInTheDocument();
    });

    it('leaves the status untouched when no marker exists', async () => {
        respond({ mount: MOUNT_A });
        const ref = renderStatus();

        await waitFor(() => expect(ref.current.state.slotA).toBe(true));
        expect(ref.current.state.status).toBe('-');
        expect(screen.getByText(/Status last update:/)).toBeInTheDocument();
    });
});
