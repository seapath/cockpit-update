/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UpdateChoice from '../../src/components/updateChoice.jsx';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('UpdateChoice', () => {
    it('shows the URL update form when selected', () => {
        const ref = React.createRef();
        render(<UpdateChoice ref={ref} />);

        fireEvent.click(screen.getByRole('button', { name: 'Update by URL' }));

        expect(ref.current.state.selectedOption).toBe('url');
        expect(screen.getByPlaceholderText('Enter URL')).toBeInTheDocument();
    });

    it('shows the upload update form when selected', () => {
        const ref = React.createRef();
        render(<UpdateChoice ref={ref} />);

        fireEvent.click(screen.getByRole('button', { name: 'Update by upload' }));

        expect(ref.current.state.selectedOption).toBe('upload');
        expect(screen.getByRole('button', { name: 'Upload File' })).toBeInTheDocument();
    });
});
