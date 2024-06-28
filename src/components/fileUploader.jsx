/*
 * Copyright (C) 2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';
import cockpit from 'cockpit';

class FileUploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      message: '',
      chunksProgress: { completed: 0, number: 0 },
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.sendChunk = this.sendChunk.bind(this);
  }

  handleFileChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  sendChunk(file, chunk, index, totalChunks, channel) {
    const reader = new FileReader();

    // Overload the method called once a file has been read (i.e. the asynchronous method readAsArrayBuffer has finished).
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      channel.send(data);

      this.setState((prevState) => ({
        message: `Chunk ${index + 1}/${totalChunks} sent successfully.`,
        chunksProgress: { completed: file.size, number: prevState.chunksProgress.number + data.length },
      }));

      if (index + 1 < totalChunks) {
        this.sendNextChunk(file, index + 1, totalChunks, channel);
      } else {
        channel.control({ command: 'done' }); // No further messages will be sent through the channel.
      }
    };

    reader.readAsArrayBuffer(chunk);
  }

  sendNextChunk(file, index, totalChunks, channel) {
    const CHUNK_SIZE = 64 * 1024; // Default size of the message sent to the socket for the RAW channel (max size: 128 kB can kill the process).
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);
    this.sendChunk(file, chunk, index, totalChunks, channel);
  }

  uploadFile() {
    const { file } = this.state;
    if (file) {
      this.setState({
        message: '',
        chunksProgress: { completed: 0, number: 0 },
      });

      const totalChunks = Math.ceil(file.size / (64 * 1024)); // Default size of the message sent to the socket for the RAW channel
      const channel = cockpit.channel({
        binary: true,
        payload: "fsreplace1", // Replace the content of the file given on the path variable
        path: `/tmp/seapath-swu-image.swu`,
        superuser: "try",
      });
      channel.addEventListener("ready", this.sendNextChunk(file, 0, totalChunks, channel))
    } else {
      this.setState({ message: 'No file selected.' });
    }
  }

  render() {
    const { chunksProgress } = this.state;
    const progress = Math.round(100 * (chunksProgress.number / chunksProgress.completed));

    return (
      <div>
        <input type="file" onChange={this.handleFileChange} accept='.swu'/>
        <button onClick={this.uploadFile}>Upload File</button>
        <p>{this.state.message}</p>

        {progress > 0 && (
          <div>
            <progress value={progress} max="100"></progress>
            <span>{progress}%</span>
          </div>
        )}
      </div>
    );
  }
}

export default FileUploader;
