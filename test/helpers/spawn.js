/*
 * Copyright (C) 2026 Savoir-faire Linux Inc.
 * SPDX-License-Identifier: Apache-2.0
 */

// Test helpers to program the mocked cockpit.spawn.

import cockpit from 'cockpit';

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

// Resolve each command from a { "command string": output } map. Commands are
// resolved on a later macrotask so the delay matches a real cockpit.spawn
// round-trip and React can commit intermediate state updates.
export function respond(responses) {
    cockpit.spawn.mockImplementation((command) => new Promise((resolve, reject) => {
        const key = command.join(' ');
        setTimeout(() => {
            if (hasOwn(responses, key)) {
                resolve(responses[key]);
            } else {
                reject(new Error(`unexpected command: ${key}`));
            }
        }, 0);
    }));
}

// Minimal implementation of the spawn object returned for a streaming command:
// it is thenable and also supports .stream()/.catch()/.finally() chaining.
export function streamingSpawn({ resolves = true, streams = [] } = {}) {
    const promise = resolves
        ? Promise.resolve()
        : Promise.reject(new Error('command failed'));
    const api = {
        stream(callback) {
            streams.forEach((chunk) => callback(chunk));
            return api;
        },
        then(callback) {
            promise.then(callback).catch(() => {});
            return api;
        },
        catch(callback) {
            promise.catch(callback);
            return api;
        },
        finally(callback) {
            promise.finally(callback).catch(() => {});
            return api;
        },
    };
    return api;
}
