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
            showRestartButton: false,
        };
        this.applyUpdate = this.applyUpdate.bind(this);
        this.restartHost = this.restartHost.bind(this);
    }

    applyUpdate() {
        this.setState({
            swuLogs: "",
            showRestartButton: false,
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
        .then(() => {
            this.setState({showRestartButton: true})
        })
    }

    restartHost() {
        cockpit.spawn(["reboot"], { superuser: "required" });
    }

    render() {
        return (
            <div className='centered-container'>
                <button onClick={this.applyUpdate}>Apply Update</button>
                <pre>{this.state.swuLogs}</pre>
                {this.state.showRestartButton && (<button onClick={this.restartHost}>Restart host</button>)}
            </div>
        );
    }
}

export default ApplyUpdate;
