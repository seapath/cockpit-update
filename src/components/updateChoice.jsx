/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Button } from '@patternfly/react-core';
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
                    <Button
                        id='updateUrl'
                        variant="secondary"
                        size='lg'
                        isActive={selectedOption === 'url' ? 'true' : ''}
                        onClick={() => this.handleOptionChange('url')}
                    >
                        Update by URL
                    </Button>
                    <Button
                        id='updateUpload'
                        variant="secondary"
                        size='lg'
                        isActive={selectedOption === 'upload' ? 'true' : ''}
                        onClick={() => this.handleOptionChange('upload')}
                    >
                        Update by upload
                    </Button>
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
