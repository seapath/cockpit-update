/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import cockpit from 'cockpit';
import React from 'react';

class ApplyUpdate extends React.Component {
    constructor() {
        super();
        this.state = {
            swuLogs: '',
        };
        this.applyUpdate = this.applyUpdate.bind(this);
    }

    applyUpdate() {
        this.setState({
            swuLogs: "",
        });
        let stdoutData = "";

        // Redirection of stderr to stdout because swupdate [ERROR] logs in the terminal are redirected to stderr by default
        cockpit.spawn(["swupdate", "-i", "/tmp/seapath-swu-image.swu"], { err: "out", superuser: "required" })
        .stream(output => {
            // Delete lines that don't belong in logs
            const cleanedOutput = output.replace(/SWUpdate v[\d.-]+[\s\S]*?Licensed under GPLv2[\s\S]*?(\n\n|$)/, '');
            stdoutData += cleanedOutput;
            this.setState({ swuLogs: stdoutData });
        })
    }

    render() {
        return (
            <div>
                <button onClick={this.applyUpdate}>Apply Update</button>
                <pre>{this.state.swuLogs}</pre>
            </div>
        );
    }
}

export default ApplyUpdate;