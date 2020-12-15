---
slug: CentOS8-OP
title: OpenProject (Docker) + CentOS 8
author: Ben Tey
author_url: https://github.com/btey
author_image_url: ../static/img/avatar/avataaars.png
tags: [CentOS, OpenProject, Docker]
---

Note: start with a CentOS 8 server installation without any extras.

## Enable EPEL and PowerTools repository for CentOS 8

To enable EPEL Repo use the following command:

```bash
dnf install epel-release
```

To enable PowerTools Repo use the folowing command:

```bash
dnf config-manager --set-enabled PowerTools
```

## Install Podman

First update your system:

```bash
dnf -y update
systemctl reboot
```

Check the available `container-tools` packages:

```bash
dnf module list  grep container-tools
```

```bash
container-tools    rhel8 [d][e]   common [d]    Common tools and dependencies for container runtimes
container-tools    1.0            common [d]    Common tools and dependencies for container runtimes
container-tools    2.0            common [d]    Common tools and dependencies for container runtimes
```

Install Podman with the following command:

```bash
dnf install -y container-tools
```

Check the `podman` version available:

```bash
podman version
```

```bash
Version:            1.6.4
RemoteAPI Version:  1
Go Version:         go1.13.4
OS/Arch:            linux/amd64
```

## Install Python 3 and git

```bash
dnf install python38 git
```

## Install `podman-compose`

```bash
pip3 install podman-compose
```
