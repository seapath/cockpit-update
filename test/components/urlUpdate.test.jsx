/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import cockpit from 'cockpit';
import URLUpdate from '../../src/components/urlUpdate.jsx';

function renderUpdate() {
    const ref = React.createRef();
    render(<URLUpdate ref={ref} />);
    return ref;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('URLUpdate', () => {
    it('stores the typed URL', () => {
        const ref = renderUpdate();

        act(() => ref.current.handleInputChange({ target: { value: 'https://x/fw.swu' } }));

        expect(ref.current.state.url).toBe('https://x/fw.swu');
    });

    it('refuses an empty URL', async () => {
        const ref = renderUpdate();

        await act(async () => ref.current.handleDownload());

        expect(ref.current.state.downloadState).toBe('failure');
        expect(ref.current.state.downloadLogs).toBe('Empty URL');
        expect(cockpit.spawn).not.toHaveBeenCalled();
    });

    it('refuses a URL that is not a swu file', async () => {
        const ref = renderUpdate();
        act(() => ref.current.setState({ url: 'https://x/fw.tar.gz' }));

        await act(async () => ref.current.handleDownload());

        expect(ref.current.state.downloadState).toBe('failure');
        expect(ref.current.state.downloadLogs).toBe('SwUpdate file expected');
        expect(cockpit.spawn).not.toHaveBeenCalled();
    });

    it('downloads a swu file and shows the log', async () => {
        cockpit.spawn.mockResolvedValue('');
        cockpit.file.mockImplementation(() => ({ read: () => Promise.resolve('wget output') }));
        const ref = renderUpdate();
        act(() => ref.current.setState({ url: 'https://x/fw.swu' }));

        await act(async () => ref.current.handleDownload());

        expect(cockpit.spawn).toHaveBeenCalledWith([
            'wget', '-nv', '-o', '/tmp/cockpit_wget.log', 'https://x/fw.swu', '-O', '/tmp/seapath-swu-image.swu',
        ]);
        expect(ref.current.state.downloadState).toBe('success');
        expect(ref.current.state.downloadLogs).toBe('wget output');
    });

    it('reports a download failure', async () => {
        vi.spyOn(console, 'log').mockImplementation(() => {});
        cockpit.spawn.mockRejectedValue(new Error('network error'));
        cockpit.file.mockImplementation(() => ({ read: () => Promise.resolve('failed log') }));
        const ref = renderUpdate();
        act(() => ref.current.setState({ url: 'https://x/fw.swu' }));

        await act(async () => ref.current.handleDownload());

        expect(ref.current.state.downloadState).toBe('failure');
        expect(ref.current.state.downloadLogs).toBe('failed log');
    });

    it('shows the failure icon when the download failed', async () => {
        const ref = renderUpdate();
        act(() => ref.current.setState({ url: '' }));

        await act(async () => ref.current.handleDownload());

        await waitFor(() => expect(screen.getByText('Logs:Empty URL')).toBeInTheDocument());
    });
});
