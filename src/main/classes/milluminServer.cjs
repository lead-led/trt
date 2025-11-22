const express = require('express');
const osc = require('osc');
const fs = require('fs');
const path = require('path');
const os = require('os');

class MilluminServer {
	localIp = '127.0.0.1';
	localPort = '8000';
	isConnected = false;
	windowRef;
	server;
	udpPort;
	_logFilePath;

	constructor(msg, windowRef) {
		const { id } = msg;
		this.server = express();
		this.windowRef = windowRef;
		this.id = id;
		this.logInfo('constructor', { id });
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
		this.logInfo('startLocalServer', { port: this.localPort, ip: this.localIp });

		this.setUdpPort();

		try {
			this.udpPort.open();
		} catch (error) {
			console.error(error);
			this.logError('udpPort.open', error);
		}

		this.udpPort.on('message', (oscMsg) => {
			const { address, args } = oscMsg;
			console.debug('[Millumin] Incoming OSC', { address, args });
			this.logInfo('oscMessage', { address, args });
			const res = { id: this.id, type: 'millumin', data: oscMsg };
			if (this.windowRef && !this.windowRef.isDestroyed()) {
				this.windowRef.webContents.send('osc-msg', JSON.stringify(res));
			}
		});

		this.udpPort.on('ready', () => {
			this.logInfo('udpReady', {
				localAddress: this.localIp,
				localPort: this.localPort,
				remoteAddress: this.udpPort.options.remoteAddress,
				remotePort: this.udpPort.options.remotePort,
			});
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
		this.logInfo('pingMillumin', { address: '/ping' });
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
			this.logInfo('stopLocalServer', { id: this.id });

			if (this.windowRef) {
				const res = { isRunning: false, id: this.id, type: 'millumin' };

				this.windowRef.webContents.send('local-server-status', JSON.stringify(res));
			}
		}
	}

	nullWindowRef() {
		this.windowRef = null;
	}

	logInfo(event, payload = {}) {
		this.appendLog({ level: 'info', event, payload });
	}

	logError(event, error) {
		const payload =
			error instanceof Error
				? { message: error.message, stack: error.stack }
				: { error: JSON.stringify(error) };
		this.appendLog({ level: 'error', event, payload });
	}

	appendLog(entry) {
		const logFilePath = this.getOrCreateLogFilePath();
		const timestamp = new Date().toISOString();
		const logEntry = JSON.stringify({ timestamp, id: this.id, ...entry });
		try {
			fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
			fs.appendFileSync(logFilePath, `${logEntry}\n`, 'utf8');
		} catch (error) {
			console.error('Failed to write Millumin log entry', error);
		}
	}

	getOrCreateLogFilePath() {
		if (this._logFilePath) {
			return this._logFilePath;
		}

		const logDir = path.join(os.tmpdir(), 'trt-logs');
		this._logFilePath = path.join(logDir, 'millumin-osc-log.ndjson');
		return this._logFilePath;
	}
}

module.exports = { MilluminServer };
