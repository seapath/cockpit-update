/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
    Text,
    TextContent,
    TextVariants,
} from '@patternfly/react-core';

class UpdateStatus extends React.Component {
    constructor() {
        super();
        this.state = {
            status: "-",
            slotA: false,
            slotB: false,
        };
    }

    getUpdateStatus() {
        // Using cockpit's file.read API to detect the existence of a file requires root access
        cockpit.spawn(["ls", "/var/log/update_success"])
            .then(() => this.setState({ status: "success"}))

        cockpit.spawn(["ls", "/var/log/update_fail"])
            .then(() => this.setState({ status: "fail"}))

        cockpit.spawn(["ls", "/var/log/update_marker"])
            .then(() => this.setState({ status: "wait for reboot"}))
    }

    getBootSlot() {
        cockpit.spawn(["mount"])
        .then((output) => {
            const regex = /\/dev\/([^\s]+) on \/ /;
            const rootfsPart = output.match(regex)[1];
            const partNumber = rootfsPart.slice(-1);

            if(partNumber == 3){
                this.setState({ slotA: true });
                this.setState({ slotB: false });
            }else if(partNumber == 4){
                this.setState({ slotA: false });
                this.setState({ slotB: true });
            }
        })
    }

    render() {
        this.getUpdateStatus();
        this.getBootSlot();

        const {status, slotA, slotB} = this.state;

        return (
            <div>
                <TextContent>
                    <Text component={TextVariants.p}>
                        <strong>Active Slot:</strong>{" "}
                        {slotA ? "Slot A" : slotB ? "Slot B" : "Unknown"}
                    </Text>
                    <Text component={TextVariants.p}>
                        <strong>Status last update:</strong> {status}
                    </Text>
                </TextContent>
            </div>
        );
    }
}

export default UpdateStatus;