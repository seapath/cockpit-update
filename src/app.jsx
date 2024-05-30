/*
 * Copyright (C) 2017-2024 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import UpdateChoice from './components/updateChoice';
import UpdateStatus from './components/updateStatus';

export class Application extends React.Component {

  render() {
    return (
      <div>
        <h1 className="title1">Update</h1>
        <UpdateStatus />
        <UpdateChoice />
      </div>
    );
  }
}
