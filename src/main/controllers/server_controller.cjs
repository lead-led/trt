const { MilluminServer } = require('../classes/milluminServer.cjs');
const { MittiServer } = require('../classes/mittiServer.cjs');
const { PlaybackProServer } = require('../classes/pbpServer.cjs');

class ServerController {
	constructor(windowRef) {
		this.milluminServers = [];
		this.mittiServers = [];
		this.playbackProServers = [];
		this.windowRef = windowRef;
	}

	handleStartServer(msg) {
		const { type } = msg;

		if (type === 'millumin') {
			this.startMilluminServer(msg);
		}
		if (type === 'mitti') {
			this.startMittiServer(msg);
		}
		if (type === 'playbackpro') {
			this.startPlaybackProServer(msg);
		}
	}

	handleStopServer(msg) {
		const { type } = msg;

		if (type === 'millumin') {
			this.stopMilluminServer(msg);
		}

		if (type === 'mitti') {
			this.stopMittiServer(msg);
		}

		if (type === 'playbackpro') {
			this.stopPlaybackProServer(msg);
		}
	}

	handleInitBackendObject(msg) {
		const { type } = msg;

		if (type === 'millumin') {
			this.createMilluminObject(msg);
		}
		if (type === 'mitti') {
			this.createMittiObject(msg);
		}
		if (type === 'playbackpro') {
			this.createPlaybackProObject(msg);
		}
	}

	handleDeleteBackendObject(msg) {
		const { type } = msg;

		if (type === 'millumin') {
			this.deleteMilluminObject(msg);
		}
		if (type === 'mitti') {
			this.deleteMittiObject(msg);
		}
		if (type === 'playbackpro') {
			this.deletePlaybackProObject(msg);
		}
	}

	startMilluminServer(msg) {
		const server = this.milluminServers.find((s) => s.id === msg.id);
		server?.startLocalServer(msg);
	}

	startMittiServer(msg) {
		const server = this.mittiServers.find((s) => s.id === msg.id);
		server?.startLocalServer(msg);
	}

	startPlaybackProServer(msg) {
		const server = this.playbackProServers.find((s) => s.id === msg.id);
		if (!server) {
			console.error('PlaybackPro server not found');
			console.error(this.playbackProServers);
			return;
		}
		server.startLocalServer(msg);
	}

	stopMilluminServer(msg) {
		const server = this.milluminServers.find((s) => s.id === msg.id);
		server.stopLocalServer();
	}

	stopMittiServer(msg) {
		const server = this.mittiServers.find((s) => s.id === msg.id);
		server.stopLocalServer();
	}

	stopPlaybackProServer(msg) {
		const server = this.playbackProServers.find((s) => s.id === msg.id);
		server.stopLocalServer();
	}

	stopAllServers() {
		this.milluminServers.forEach((s) => s.stopLocalServer());
		this.mittiServers.forEach((s) => s.stopLocalServer());
		this.playbackProServers.forEach((s) => s.stopLocalServer());
	}

	createMilluminObject(msg) {
		const server = new MilluminServer(msg, this.windowRef);
		this.milluminServers.push(server);
	}

	deleteMilluminObject(msg) {
		const server = this.milluminServers.find((s) => s.id === msg.id);
		if (!server) {
			console.error('Millumin server not found');
			console.error(this.milluminServers);
			return;
		}
		server.stopLocalServer();
		this.milluminServers = this.milluminServers.filter((s) => s.id !== msg.id);
	}

	deletePlaybackProObject(msg) {
		const server = this.playbackProServers.find((s) => s.id === msg.id);
		if (!server) {
			console.error('PlaybackPro server not found');
			console.error(this.playbackProServers);
			return;
		}
		server.stopLocalServer();
		this.playbackProServers = this.playbackProServers.filter((s) => s.id !== msg.id);
	}

	createMittiObject(msg) {
		const server = new MittiServer(msg, this.windowRef);
		this.mittiServers.push(server);
	}

	deleteMittiObject(msg) {
		const server = this.mittiServers.find((s) => s.id === msg.id);
		if (!server) {
			console.error('Mitti server not found');
			console.error(this.mittiServers);
			return;
		}
		server.stopLocalServer();
		this.mittiServers = this.mittiServers.filter((s) => s.id !== msg.id);
	}

	deleteMilluminObjects(msg) {
		const server = this.milluminServers.find((s) => s.id === msg.id);
		if (!server) {
			console.error('mitti server not found');
			console.error(this.mittiServers);
			return;
		}
		server.stopLocalServer();
		this.milluminServers = this.milluminServers.filter((s) => s.id != msg.id);
	}

	createPlaybackProObject(msg) {
		const server = new PlaybackProServer(msg, this.windowRef);
		this.playbackProServers.push(server);
	}

	killAllInstances() {}

	nullAddWindowRefs() {
		this.milluminServers.forEach((s) => s.nullWindowRef());
		this.mittiServers.forEach((s) => s.nullWindowRef());
		this.playbackProServers.forEach((s) => s.nullWindowRef());
	}
}

module.exports = { ServerController };
