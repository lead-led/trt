const express = require('express');
const osc = require('osc');

class MittiServer {
	localIp = '127.0.0.1';
	localPort = '1234';
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
			const res = { id: this.id, type: 'mitti', data: oscMsg };
			// console.log(oscMsg);
			if (this.windowRef && !this.windowRef.isDestroyed()) {
				this.windowRef.webContents.send('osc-msg', JSON.stringify(res));
			}
		});

		const res = {
			isRunning: true,
			id: this.id,
			type: 'mitti',
			address: `${this.localIp}:${this.localPort}`,
		};

		this.windowRef.webContents.send('local-server-status', JSON.stringify(res));
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
				const res = { isRunning: false, id: this.id, type: 'mitti' };

				this.windowRef.webContents.send('local-server-status', JSON.stringify(res));
			}
		}
	}

	nullWindowRef() {
		this.windowRef = null;
	}
}

module.exports = { MittiServer };
