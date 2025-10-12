# TRT User Guide

This guide explains how to operate TRT (Total Remaining Time) based solely on the behaviour visible in the repository. TRT is a desktop Electron application that listens to playback systems (Mitti, Millumin, and Playback Pro), gathers their time remaining information, and renders one or more draggable countdown tiles on screen.

---

# 1. Running the application

## 1.1 Packaged build
- Download the latest signed DMG from the [GitHub Releases page](https://github.com/lead-led/trt/releases) and open it.
- Drag TRT into Applications and launch it from there.
- On first launch macOS may warn that the app was downloaded from the internet; approve the prompt to proceed.

## 1.2 Running from source
Use this path if you prefer to run a development build.

```bash
npm install          # install dependencies
npm run dev          # start Svelte + Electron with hot reload
```

To create a production bundle for the current platform:

```bash
npm run package      # builds the Svelte UI and packages Electron
```

The main process entry point is `src/electron.cjs`. The Svelte front-end is built with Vite.

---

# 2. Interface tour
- **Settings panel** – Opens by default on launch. After you close it, move your cursor near the bottom-right corner to fade in the gear icon and click it to reopen.
- **Playback tiles** – Each timer represents a track, layer, or cue reported by a playback instance. Tiles are draggable anywhere within the window.
- **Timer controls** – Hover a timer to reveal a range slider that adjusts its font size. The slider disappears a second after you leave the timer.
- **Status toasts** – Each instance surface shows “running” or “stopped” plus a coloured dot (green = connected, red = stopped).

---

# 3. Managing playback instances

1. Open the Settings panel.
2. Choose **Mitti**, **Millumin**, or **Playback Pro** from the “Select Playback Type” list.
3. Click **Add Instance** to create the instance entry.
4. Click the instance header to expand its controls.
5. (Optional) Enter a *Label* to append to the instance name; this label is used for the timer tile title.
6. Configure network details (explained per integration below).
7. Click **Start Server** / **Connect** to begin listening.

You can stop a connection with **Stop Server**. Removing an instance tears down the background server and deletes its timers.

TRT prevents you from starting two instances bound to the same IP and port pair.

---

# 4. Integration specifics

## 4.1 Mitti
- **Purpose** – Receives OSC `/mitti/cueTimeLeft` and `/mitti/cueTimeElapsed` messages and converts them into a single countdown tile.
- **Configuration steps**
  - Select the NIC/IP address that belongs to the computer running TRT. The drop-down is populated automatically from your active network interfaces.
  - Set a UDP port (defaults to `1234`). The port must match the OSC output port configured in Mitti’s preferences.
  - Click **Start Server**. TRT starts a local OSC listener and waits for Mitti messages.
- **What you should see** – Once Mitti starts sending cue data the timer tile updates once per message. Stopping the server removes the timer.

## 4.2 Millumin
- **Purpose** – Listens for OSC `/millumin/.../media/time` updates per layer. Each new layer becomes an individual timer tile.
- **Configuration steps**
  - Select the NIC/IP for the machine running TRT.
  - Set the UDP port to the value Millumin is sending to (default `8000` in the UI). Millumin’s OSC output must be pointed to the same IP/port.
  - Click **Start Server**. TRT spins up an OSC UDP port bound to the chosen address and automatically pings Millumin on port `5000`, which is Millumin’s default inbound OSC port.
- **What you should see** – Incoming layer updates create timers. Use the “Toggle Layers” checkboxes that appear under the instance to hide or show individual layer timers without removing them entirely.

## 4.3 Playback Pro
- **Purpose** – Polls a Playback Pro system over TCP port `4647` using the `TR` command to retrieve the total and remaining time of the loaded clip.
- **Configuration steps**
  - Enter the IP address of the computer running Playback Pro. This field is free-form; make sure remote control is enabled in Playback Pro.
  - Adjust the port if you have changed it from Playback Pro’s default (`4647`).
  - Click **Connect**. TRT opens a TCP socket, requests time remaining every 33 ms, and updates the timer display.
- **What you should see** – When the connection succeeds the status switches to “running” and the timer begins counting down. Use **Stop** to terminate the TCP connection.

---

# 5. Working with timers
- **Appearance** – Each tile displays `HH:MM:SS`, a progress bar, and an optional label (instance name or custom label).
- **Dragging** – Click and drag anywhere on the tile to reposition it. The cursor changes to indicate drag mode while hovered.
- **Sizing** – Hover to reveal the size slider. The slider affects only the hovered tile so you can size different timers independently.
- **Visibility controls** – When a playback type reports multiple layers (Millumin) a checkbox list appears in Settings; unchecking a layer hides its timer but retains the connection.
- **Stale data detection** – If a timer stops receiving updates for more than roughly a second, TRT fades the tile and resets it to `00:00:00` to show that the source has stopped reporting.

---

# 6. Interpretation of status fields
- **Local IP / Local Port** – The address TRT is bound to for inbound data (Mitti/Millumin) or the remote Playback Pro address for TCP.
- **Server Address** – Appears after a connection starts. For Mitti and Millumin this is the local binding; for Playback Pro it is the remote host and port.
- **Status dot** – Green indicates an active connection, red indicates stopped.
- **Version and IP discovery** – On launch TRT retrieves the app version and scans the host network adapters so you do not need to type addresses manually.

---

# 7. Troubleshooting tips
- **Port already in use** – TRT will alert you if an instance is already using the selected IP/port. Choose a different port or stop the conflicting instance first.
- **No timers appear** – Confirm the external application is sending OSC/TCP data to the IP/port shown in TRT. You should see the status switch to “running” shortly after data arrives.
- **Timers reset to zero** – This indicates the source stopped transmitting updates. Check the remote playback software.
- **Playback Pro connection fails** – Ensure remote control is enabled in Playback Pro and that macOS’ firewall allows TRT access.
- **Reopening Settings** – Move your mouse to the bottom-right corner to reveal the gear icon if the panel is hidden.

---

By following these steps you can add playback devices, monitor their remaining time, and tailor the on-screen timers to suit your show layout.
