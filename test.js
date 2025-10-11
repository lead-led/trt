import osc from 'osc';
import express from 'express';

class MilluminServer {
	localIp = '127.0.0.1';
	localPort = '8000';
	isConnected = false;
	windowRef;
	server;
	udpPort;
	layers = new Set();
	oscMessages = [];

	constructor(msg) {
		const { id } = msg;
		this.server = express();
		// this.windowRef = windowRef;
		this.id = id;
	}

	// setWindowRef(windowRef) {
	// 	this.windowRef = windowRef;
	// }

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
		// this.stopLocalServer();

		// this.localPort = msg.port;
		// this.localIp = msg.localIp;

		this.setUdpPort();

		try {
			this.udpPort.open();
		} catch (error) {
			console.error(error);
		}

		this.udpPort.on('message', (oscMsg) => {
			// const res = { id: this.id, type: 'millumin', data: oscMsg };
			// console.log(oscMsg);
			// this.parseMilluminLayers(oscMsg);
			// if (this.windowRef && !this.windowRef.isDestroyed()) {
			// 	this.windowRef.webContents.send('osc-msg', JSON.stringify(res));
			// }
			// if (oscMsg.address.includes('info')) {
			// 	console.log(oscMsg.args[0].value);
			// }
			this.oscMessages.push(oscMsg);
		});
	}

	parseMilluminLayers() {
		this.oscMessages.forEach((msg) => {
			const address = msg.address;
			if (address.startsWith('/millumin/layer:') && !address.includes('layer:states')) {
				const layerName = address.split('/')[2].split('/')[0]; // Extract layer name
				this.layers.add(layerName);
			}
		});

		return Array.from(this.layers);
	}

	sendMessage() {
		const msg = 'test';
		this.udpPort.send({
			address: '/millumin/index:1/opacity',
			args: [
				'0.1',
				// {
				// 	type: 's',
				// 	value: 2,
				// },
			],
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

	// nullWindowRef() {
	// 	this.windowRef = null;
	// }
}

const m = new MilluminServer({ id: 'test' });

m.startLocalServer();
// sleep for 1000
setTimeout(() => {
	m.parseMilluminLayers();
}, 1000);

m.udpPort.on('ready', function () {
	m.udpPort.send({
		address: '/millumin/ping',
	});
});
