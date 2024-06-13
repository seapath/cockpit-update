<!-- Copyright (C) 2024 Savoir-faire Linux Inc.
SPDX-License-Identifier: Apache-2.0 -->

# cockpit-update

This is a [Cockpit](https://cockpit-project.org/) plugin to deploy a SWupdate on Seapath Yocto.

Features of the plugin:
- Fetch swu file
- Perform the update
- Display the status of the update (before and after reboot)
- Display the active slot

Options available to get the swu file:
- Upload from client
- Download from url

This plugin requires administrative access.

## Getting and building the source

This React project uses npm as package manager.

The first build of the plugin requires to run the following command that will install the dependances defined in the package.json. It will also build the sources on the directory /dist.
```
npm run init
```

To rebuild the project, the script build.js can be used using:
```
npm run build
```

The build files and the dependances can be removed using:
```
npm run clean
```

## Installing

To install this Cockpit plugin, the build sources located in the /dist directory must be copied to `/usr/share/cockpit/cockpit-cluster-update`.
The installation can be verified by looking at the list of Cockpit packages given by `cockpit-bridge --packages`.

The following ansible playbook can also be used:

```YAML
---
- name: cockpit plugins installation
  hosts:
    - cluster_machines
  become: true
  vars:
    cockpit_plugin_path: "/usr/share/cockpit"
  tasks:
    - name: Check if cockpit is installed
      command: which cockpit-bridge
      register: cockpit_status

    - name: Install plugin
      ansible.builtin.copy:
        src: dist_directory/
        dest: "{{ cockpit_plugin_path }}/cockpit-cluster-update"
        mode: '644'
        owner: root
      when: cockpit_status.rc == 0


```