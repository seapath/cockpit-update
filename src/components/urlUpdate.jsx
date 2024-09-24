/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import cockpit from 'cockpit';
import ApplyUpdate from './applyUpdate';

import { CheckCircleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { Button } from '@patternfly/react-core';

class URLUpdate extends React.Component {
    constructor() {
        super();
        this.state = {
            url: '',
            downloadState:'',
            downloadLogs:'',
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    handleInputChange(event) {
        this.setState({ url: event.target.value });
    }

    async handleDownload() {
        const { url } = this.state;
        const ext = this.getFileExtension(url);

        if(url.trim() === ''){
            this.setState({
                downloadState: "failure",
                downloadLogs: "Empty URL",
            });
            return;
        }else if(ext !== "swu"){
            this.setState({
                downloadState: "failure",
                downloadLogs: "SwUpdate file expected",
            });
            return;
        }

        this.setState({
            downloadState: "running",
            downloadLogs: "-",
        });

        await cockpit.spawn(["wget","-nv", "-o", "/tmp/cockpit_wget.log", url, "-O", "/tmp/seapath-swu-image.swu"])
            .then(()=>{
                this.setState({downloadState: "success"});
            })
            .catch(error=>{
                console.log(error.message);
                this.setState({downloadState: "failure"});
            })

        await cockpit.file("/tmp/cockpit_wget.log").read()
            .then(downloadLogs =>{
                this.setState({downloadLogs: downloadLogs});
            })
    }

    getFileExtension(url) {
        // Get the filename from the url
        const filename = url.substring(url.lastIndexOf("/") + 1);

        const extension = filename.split(".").pop();

        return extension;
    }

    render() {
        const { downloadState } = this.state;
        return (
            <div>
                <div className='input-container'>
                    <input
                        type="text"
                        value={this.state.url}
                        onChange={this.handleInputChange}
                        placeholder="Enter URL"
                    />
                    <Button onClick={this.handleDownload} variant='secondary'>Download</Button>

                    <div className='icon'>
                        {downloadState === "success" && <CheckCircleIcon style={{ width: '30px', height: '30px', color: 'green' }}/>}
                        {downloadState === "failure" && <ExclamationCircleIcon style={{ width: '30px', height: '30px', color: 'red' }}/>}
                    </div>
                </div>
                <br/>
                <div>{"Logs:" + this.state.downloadLogs}</div>
                <br/>
                <div className='centered-container'>
                    <ApplyUpdate/>
                </div>
            </div>
        );
    }
}

export default URLUpdate;
