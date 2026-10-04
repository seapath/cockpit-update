/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import cockpit from 'cockpit';
import ApplyUpdate from '../../src/components/applyUpdate.jsx';
import { streamingSpawn } from '../helpers/spawn.js';

function renderApply() {
    const ref = React.createRef();
    render(<ApplyUpdate ref={ref} />);
    return ref;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ApplyUpdate', () => {
    it('streams the update log without the banner and reveals the restart button', async () => {
        cockpit.spawn.mockImplementation(() => streamingSpawn({
            streams: ['SWUpdate v2024.05\n\nLicensed under GPLv2\n\nreal log line\n'],
        }));
        const ref = renderApply();

        act(() => ref.current.applyUpdate());

        await waitFor(() => expect(ref.current.state.showRestartButton).toBe(true));
        expect(ref.current.state.swuLogs).toBe('real log line\n');
        expect(cockpit.spawn).toHaveBeenCalledWith(
            ['swupdate', '-i', '/tmp/seapath-swu-image.swu'],
            { err: 'out', superuser: 'required' }
        );
    });

    it('restarts the host', () => {
        cockpit.spawn.mockResolvedValue('');
        const ref = renderApply();

        act(() => ref.current.restartHost());

        expect(cockpit.spawn).toHaveBeenCalledWith(['reboot'], { superuser: 'required' });
    });

    it('shows the restart button', () => {
        renderApply();

        expect(screen.getByRole('button', { name: 'Restart host' })).toBeInTheDocument();
    });
});
