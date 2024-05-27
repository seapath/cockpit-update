/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import FileUploader from './fileUploader';
import ApplyUpdate from './applyUpdate';

export default class UploadUpdate extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <FileUploader />
                <br/>
                <ApplyUpdate />
            </div>
        );
    }
}
