---
slug: postgresql-enable-disable-autostart-macos
title: PostgreSQL - Enable/Disable autostart on macOS
author: Ben Tey
author_url: https://github.com/btey
author_image_url: ../img/avatar/avataaars.png
tags: [macOS, PostgreSQL, Autostart]
---

## Enable PostgreSQL autostart

To **enable** a PostgreSQL instance from starting when you turn on your mac run the following command:

```bash
sudo launchctl load -w /Library/LaunchDaemons/com.edb.launchd.postgresql-x.x.plist
```

## Disable PostgreSQL autostart

To **disable** a PostgreSQL instance from starting when you turn on your mac run the following command:

```bash
sudo launchctl unload -w /Library/LaunchDaemons/com.edb.launchd.postgresql-x.x.plist
```

:::note

The `unload -w` should add a `<Disabled><true/>` key to the plist file. If for some reason that doesn't work, manually add the Disabled key.

:::