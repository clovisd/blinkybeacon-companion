# companion-module-blinkybeacon

A [BitFocus Companion](https://bitfocus.io/companion) module for controlling the **BlinkyBeacon** USB warning light (Farming Simulator 22 Collector's Edition).

This module communicates with [blinkybeacon-tray](https://github.com/clovisd/blinkybeacon-web), a Windows tray utility that owns the USB connection and exposes a local HTTP API.

---

## Prerequisites

**[blinkybeacon-tray](https://github.com/clovisd/blinkybeacon-web) must be running** on the same machine as Companion, or on a reachable host if you configure a non-localhost address in the tray settings.

---

## Installation

### Web UI (recommended)

1. Download `companion-module-blinkybeacon-1.1.0.tgz` from [Releases](../../releases)
2. In Companion: **Settings → Modules → Import module** → select the `.tgz`
3. Restart Companion if prompted

### Developer mode

Clone this repo and copy (or symlink) the `final-build/` folder:

```powershell
# Run: npm run bundle  first to populate final-build/
New-Item -ItemType Junction `
  -Path "$env:APPDATA\Companion\developer_modules\companion-module-blinkybeacon" `
  -Target "final-build"
```

---

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| Host | `localhost` | Hostname or IP where `blinkybeacon-tray` is running |
| Port | `1337` | HTTP port (must match the tray app's configured port) |

---

## Actions

| Action | Description |
|--------|-------------|
| Spin beacon | Starts the rotating amber light |
| Flash beacon | Starts the flashing strobe light |
| Stop beacon | Turns the beacon off |

---

## Feedbacks

Feedbacks are updated every 2 seconds via polling `GET /status`.

| Feedback | Condition | Default colour |
|----------|-----------|----------------|
| Tray online | HTTP server is reachable | Green |
| Beacon active | State is `spin` or `flash` | Amber |
| Beacon spinning | State is `spin` | Green |
| Beacon flashing | State is `flash` | Red |
| Beacon idle | State is `idle` | Dark grey |

**Tray online** turns on when `blinkybeacon-tray` is running and responding to HTTP requests, regardless of whether a physical beacon is connected. Use it to confirm the tray app is up before triggering beacon actions.

---

## Build from source

```bash
npm install
npm run bundle   # type-checks, bundles with esbuild → .tgz + final-build/
```

---

## License

MIT
