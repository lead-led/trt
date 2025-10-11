const express = require('express');
const osc = require('osc');
const ip = require('ip');

class Server {
	ipAddr = '192.168.0.1';
	isConnected = false;
	windowRef = null;
	localPort = '8000';
	server;
	udpPort;
	localIp;
	ip;

	constructor() {
		this.server = express();
		this.ip = ip.address();
	}

	setWindowRef(windowRef) {
		this.windowRef = windowRef;
	}

	setUdpPort() {
		this.udpPort = new osc.UDPPort({
			localAddress: '127.0.0.1',
			localPort: 8000,
			metadata: true,
		});
	}

	startLocalServer(msg) {
		this.stopLocalServer();

		this.localPort = msg;

		this.setUdpPort();

		this.udpPort.open();

		this.udpPort.on('message', (oscMsg) => {
			if (this.windowRef) {
				this.windowRef.webContents.send('osc-msg', oscMsg);
			}
		});

		this.windowRef?.webContents.send('local-server-status', true);
	}

	killUpdPort() {
		if (this.udpPort) {
			this.udpPort.close();
			this.udpPort = null;
		}
	}

	stopLocalServer() {
		if (this.udpPort) {
			this.udpPort.close();
			this.udpPort = null;

			if (this.windowRef) {
				this.windowRef.webContents.send('local-server-status', false);
			}
		}
	}
}

module.exports = { Server };
