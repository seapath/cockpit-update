/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import UploadUpdate from '../../src/components/uploadUpdate.jsx';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('UploadUpdate', () => {
    it('shows the uploader and the apply button', () => {
        render(<UploadUpdate />);

        expect(screen.getByRole('button', { name: 'Upload File' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Apply Update' })).toBeInTheDocument();
    });
});
