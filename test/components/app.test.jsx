/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Application } from '../../src/app.jsx';
import { respond } from '../helpers/spawn.js';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Application', () => {
    it('renders the update status and the update choice', async () => {
        respond({ mount: '/dev/mmcblk0p3 on / type ext4 (rw)\n' });
        const ref = React.createRef();

        render(<Application ref={ref} />);

        expect(screen.getByText('Update')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Update by URL' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Update by upload' })).toBeInTheDocument();
        await waitFor(() => expect(ref.current).toBeDefined());
    });
});
