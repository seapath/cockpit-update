/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import cockpit from 'cockpit';
import FileUploader from '../../src/components/fileUploader.jsx';

function renderUploader() {
    const ref = React.createRef();
    render(<FileUploader ref={ref} />);
    return ref;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('FileUploader', () => {
    it('stores the selected file', () => {
        const ref = renderUploader();
        const file = new File(['x'], 'fw.swu');

        act(() => ref.current.handleFileChange({ target: { files: [file] } }));

        expect(ref.current.state.file).toBe(file);
    });

    it('asks for a file when none is selected', () => {
        const ref = renderUploader();

        act(() => ref.current.uploadFile());

        expect(ref.current.state.message).toBe('No file selected.');
        expect(cockpit.channel).not.toHaveBeenCalled();
    });

    it('uploads a file through the fsreplace1 channel', async () => {
        const ref = renderUploader();
        act(() => ref.current.setState({ file: new File(['hello'], 'fw.swu') }));

        act(() => ref.current.uploadFile());
        await waitFor(() => expect(cockpit.channel).toHaveBeenCalled());
        expect(cockpit.channel.mock.calls[0][0]).toMatchObject({
            payload: 'fsreplace1',
            path: '/tmp/seapath-swu-image.swu',
        });

        act(() => cockpit.lastChannel().emit('ready'));

        await waitFor(() => expect(cockpit.lastChannel().control).toHaveBeenCalledWith({ command: 'done' }));
        expect(cockpit.lastChannel().send).toHaveBeenCalled();
        expect(ref.current.state.message).toBe('Chunk 1/1 sent successfully.');
        expect(screen.getByText('Chunk 1/1 sent successfully.')).toBeInTheDocument();
    });
});
