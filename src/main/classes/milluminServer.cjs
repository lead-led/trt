const express = require('express');
const osc = require('osc');

class MilluminServer {
	localIp = '127.0.0.1';
	localPort = '8000';
	isConnected = false;
	windowRef;
	server;
	udpPort;

	constructor(msg, windowRef) {
		const { id } = msg;
		this.server = express();
		this.windowRef = windowRef;
		this.id = id;
	}

	setWindowRef(windowRef) {
		this.windowRef = windowRef;
	}

	setlocalIp(ip) {}

	setUdpPort() {
		this.udpPort = new osc.UDPPort({
			localAddress: this.localIp,
			localPort: this.localPort,
			remoteAddress: this.localIp, // Replace with Millumin's IP
			remotePort: '5000', // Replace with Millumin's OSC Port
			metadata: true,
		});
	}

	startLocalServer(msg) {
		this.stopLocalServer();

		this.localPort = msg.port;
		this.localIp = msg.localIp;

		this.setUdpPort();

		try {
			this.udpPort.open();
		} catch (error) {
			console.error(error);
		}

		this.udpPort.on('message', (oscMsg) => {
			const res = { id: this.id, type: 'millumin', data: oscMsg };
			if (this.windowRef && !this.windowRef.isDestroyed()) {
				this.windowRef.webContents.send('osc-msg', JSON.stringify(res));
			}
		});

		this.udpPort.on('ready', () => {
			this.pingMillumin();
		});

		const res = {
			isRunning: true,
			id: this.id,
			type: 'millumin',
			address: `${this.localIp}:${this.localPort}`,
		};
		if (this.windowRef && !this.windowRef.isDestroyed()) {
			this.windowRef.webContents.send('local-server-status', JSON.stringify(res));
		}
	}

	pingMillumin() {
		this.udpPort.send({
			address: '/ping',
			args: [],
		});
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
				const res = { isRunning: false, id: this.id, type: 'millumin' };

				this.windowRef.webContents.send('local-server-status', JSON.stringify(res));
			}
		}
	}

	nullWindowRef() {
		this.windowRef = null;
	}
}

module.exports = { MilluminServer };
