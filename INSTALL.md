# companion-module-blinkybeacon

BitFocus Companion module for controlling the Farming Simulator USB beacon (BlinkyBeacon) via the [blinkybeacon-tray](../blinkybeacon/) HTTP server.

## Prerequisites

1. **`blinkybeacon-tray.exe` must be running** on the same Windows machine as Companion.  
   Build it from the `blinkybeacon` repo. Default port: `1337`.

2. **BitFocus Companion 3.x** installed.

## Install (Developer Mode)

1. Build the module:
   ```bash
   npm install
   npm run build
   ```

2. Copy (or symlink) the entire project folder into Companion's developer modules directory:
   - Windows: `%APPDATA%\Companion\developer_modules\companion-module-blinkybeacon\`
   
   PowerShell (symlink — changes to source apply immediately after rebuild):
   ```powershell
   New-Item -ItemType Junction `
     -Path "$env:APPDATA\Companion\developer_modules\companion-module-blinkybeacon" `
     -Target (Get-Location)
   ```

3. Enable **Developer mode** in Companion settings, then restart Companion.

4. Add a connection: **Connections → Add → search "BlinkyBeacon"**  
   Configure: `host = localhost`, `port = 1337`

## Available Actions

| Action | Effect |
|--------|--------|
| Spin beacon | Starts the spinning light effect |
| Flash beacon | Starts the flashing/strobe effect |
| Stop beacon | Turns the beacon off |

## Available Feedbacks

| Feedback | Button lights up when... |
|----------|--------------------------|
| Beacon active | Beacon is spinning or flashing (amber) |
| Beacon spinning | Beacon is spinning (green) |
| Beacon flashing | Beacon is flashing (red) |
| Beacon idle | Beacon is off (dark grey) |

## URL Trigger

You don't need Companion to trigger the beacon — call the HTTP API directly:

```powershell
# From PowerShell on the same machine as blinkybeacon-tray
Invoke-RestMethod -Uri http://localhost:1337/spin  -Method Post
Invoke-RestMethod -Uri http://localhost:1337/flash -Method Post
Invoke-RestMethod -Uri http://localhost:1337/stop  -Method Post
Invoke-RestMethod -Uri http://localhost:1337/status -Method Get
```

Or from any tool/language that can make HTTP requests.
