/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import URLUpdate from './urlUpdate';
import UploadUpdate from './uploadUpdate';

class UpdateChoice extends React.Component {
    constructor() {
        super();
        this.state = {
            selectedOption: ''
        };
    }

    handleOptionChange(option) {
        this.setState({ selectedOption: option });
    }

    render() {
        const { selectedOption } = this.state;
        return (
            <div>
                <div className="tabs">
                    <button
                        className={selectedOption === 'url' ? 'active' : ''}
                        onClick={() => this.handleOptionChange('url')}
                    >
                        Update by URL
                    </button>
                    <button
                        className={selectedOption === 'upload' ? 'active' : ''}
                        // Feature not enabled
                        onClick={() => this.handleOptionChange('')}
                    >
                        Update by upload
                    </button>
                </div>

                <div >
                    {selectedOption === 'url' && <URLUpdate />}
                    {selectedOption === 'upload' && <UploadUpdate />}
                </div>
            </div>
        );
    }
}

export default UpdateChoice;