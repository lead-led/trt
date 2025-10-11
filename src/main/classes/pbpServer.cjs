const net = require('net');

class PlaybackProServer {
	windowRef;
	playbackProIp = '127.0.0.1';
	playbackProPort = 4647;
	client;
	dataListener;
	errorListener;
	id;

	constructor(msg, windowRef) {
		const { id } = msg;

		this.id = id;
		this.windowRef = windowRef;
	}

	setClient() {
		this.client = new net.Socket();
	}

	async startLocalServer(msg) {
		this.playbackProIp = msg.localIp;
		this.setClient();
		const connected = await this.connect();

		if (!connected) {
			console.error('PlaybackPro server not connected');
			return;
		}

		this.sendStatusToWindow(true);

		this.startListeners();

		this.getTimeRemaining();
	}

	async stopLocalServer() {
		clearTimeout(this.timeoutt);
		this.disconnect();
		this.client = null;
	}

	sendStatusToWindow(status) {
		const statsMsg = {
			isRunning: status,
			id: this.id,
			type: 'playbackpro',
			address: `${this.playbackProIp}:${this.playbackProPort}`,
		};

		this.windowRef.webContents.send('local-server-status', JSON.stringify(statsMsg));
	}

	sendDataToWindow(data) {
		const res = { id: this.id, type: 'playbackpro', data };

		if (this.windowRef && !this.windowRef.isDestroyed()) {
			this.windowRef.webContents.send('osc-msg', JSON.stringify(res));
		}
	}

	startListeners() {
		this.client.on('data', (data) => this.handleDataResponse(data));
		this.client.on('error', (err) => this.handleError(err));
	}

	connect() {
		return new Promise((resolve, reject) => {
			if (!this.client) {
				resolve(false);
				return;
			}

			this.client.connect(this.playbackProPort, this.playbackProIp, () => {
				resolve(true);
			});

			// Here, you might want to add error handling specifically for the connect.
			this.client.on('error', (err) => {
				console.error('Error during connection:', err);
				resolve(false);
			});
		});
	}

	disconnect() {
		if (!this.client) return;

		this.client.destroy();
		this.client = null;
	}

	getTimeRemaining() {
		const command = 'TR';

		this.sendRequest(command);

		this.timeoutt = setTimeout(() => {
			this.getTimeRemaining();
		}, 33);
	}

	sendRequest(command) {
		const commandMsg = command + '\r\n';

		this.client.write(commandMsg, () => {
			// console.log('TCP message sent successfully');
		});
	}

	handleDataResponse(data) {
		const timestampRegex = /^([0-5]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;

		if (timestampRegex.test(data.toString())) {
			this.handleTimeStamps(data.toString());
		}
	}

	handleTimeStamps(data) {
		this.sendDataToWindow(data);
	}

	handleError(err) {
		console.error('PlaybackPro error', err);
	}

	setWindowRef(windowRef) {
		this.windowRef = windowRef;
	}

	nullWindowRef() {
		this.windowRef = null;
	}
}

module.exports = { PlaybackProServer };
