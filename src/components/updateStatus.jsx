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
import cockpit from 'cockpit';
import { parseBootSlot } from '../lib/updateParsing';

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
        cockpit.spawn(["ls", "/var/log/update_success"], { err: "ignore" })
            .then(() => this.setState({ status: "success"}))
            .catch(() => {})

        cockpit.spawn(["ls", "/var/log/update_fail"], { err: "ignore" })
            .then(() => this.setState({ status: "fail"}))
            .catch(() => {})

        cockpit.spawn(["ls", "/var/log/update_marker"], { err: "ignore" })
            .then(() => this.setState({ status: "wait for reboot"}))
            .catch(() => {})
    }

    getBootSlot() {
        cockpit.spawn(["mount"])
        .then((output) => {
            const slot = parseBootSlot(output);
            this.setState({ slotA: slot === "A" });
            this.setState({ slotB: slot === "B" });
        })
        .catch(() => {})
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
