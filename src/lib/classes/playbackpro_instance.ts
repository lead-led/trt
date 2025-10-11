import {
	updateMilluminTime,
	createMilluminTime,
	setTimeVisibility,
	handlePlaybackProTime,
} from '$lib/controllers/instances_controller';
import { PlaybackInstance } from './playback_instance.svelte';
import type { PlaybackObject } from '$lib/types';

declare let window: any;

export class PlaybackProInstance extends PlaybackInstance {
	constructor(newIndex: number) {
		super(newIndex);
		this._name = 'Playback Pro';

		this.initBackendObject();
	}

	get thisObj(): PlaybackObject {
		return {
			id: this.id,
			port: this.port,
			localIp: this.ip,
			isConnected: this.isConnected,
			localServerStatus: this.localServerStatus,
			layers: this.layers,
			index: this._index,
			type: 'playbackpro',
			isLocalServerRunning: this.isLocalServerRunning,
			isVisible: this._isVisible,
			name: this.displayName,
			label: this.label,
			displayName: this.displayName,
			timeRemaining: this.timeRemaining,
			totalTime: this.totalTime,
			timeLeftInSeconds: this._timeLeftInSeconds,
		};
	}

	initBackendObject() {
		window.electron.send('init-backend-object', JSON.stringify(this.thisObj));
	}

	setPort(newPort: string) {
		this._port = newPort;
	}

	setIP(newIp: string) {
		this._ip = newIp;
	}

	setIsConnected(newStatus: boolean) {
		this._isConnected = newStatus;
	}

	handleNewMessage(msg: any) {
		this.getAndSetCueTimeLeft(msg);
		this.getAndSetCueTimeElapsed(msg);
		this.setTimeRemaining();
		this.setTimeElapsed();

		if (this._timeLeftInSeconds !== null && this._timeElapsedInSeconds !== null) {
			const timeLeft = this._timeLeftInSeconds;
			const timeElapsed = this._timeElapsedInSeconds;

			if (timeLeft !== null && timeElapsed !== null) {
				this._totalTime = timeLeft + timeElapsed;
				this._timeRemaining = timeLeft;
			}
		}

		handlePlaybackProTime(this.thisObj);
	}

	getAndSetCueTimeElapsed(msg: string) {
		this._cueTimeElapsed = msg;
	}

	setTimeElapsed() {
		const timeElapsedArray = this._cueTimeElapsed?.split(':');

		if (!timeElapsedArray) return;

		const hoursToSeconds = parseInt(timeElapsedArray[0]) * 60 * 60;
		const minutesToSeconds = parseInt(timeElapsedArray[1]) * 60;
		const seconds = parseInt(timeElapsedArray[2]);
		const frames = parseInt(timeElapsedArray[3]);
		const timeElapsedInSeconds = hoursToSeconds + minutesToSeconds + seconds;

		this._timeElapsedInSeconds = timeElapsedInSeconds;
	}

	getAndSetCueTimeLeft(msg: any) {
		// let isCueTimeLeft = msg.address.includes('/cueTimeLeft');
		// if (!isCueTimeLeft) return;

		// const cueTimeLeft = msg.args[0].value;
		this._cueTimeLeft = msg;
	}

	setTimeRemaining() {
		const timeLeftArray = this._cueTimeLeft?.split(':');

		if (!timeLeftArray) return;

		const hoursToSeconds = parseInt(timeLeftArray[0]) * 60 * 60;
		const minutesToSeconds = parseInt(timeLeftArray[1]) * 60;
		const seconds = parseInt(timeLeftArray[2]);
		const frames = parseInt(timeLeftArray[3]);

		const timeLeftInSeconds = hoursToSeconds + minutesToSeconds + seconds;

		this._timeLeftInSeconds = timeLeftInSeconds;
	}

	setTimeLeftInSeconds(msg: string) {
		let array = msg.split(':');
		let totalSeconds = +array[0] * 3600 + +array[1] * 60 + +array[2] * 1;
		this._timeLeftInSeconds = totalSeconds;
	}

	startLocalServer(portInput: any) {
		portInput && this.setPort(portInput);

		const msg = {
			port: this._port,
			localIp: this._ip,
			instanceIndex: this.index,
			id: this.id,
			type: 'playbackpro',
		};

		if (this.ip && this.port) {
			window.electron.send('start-server', JSON.stringify(msg));
		}
	}

	stopLocalServer() {
		const msg = { id: this.id, type: 'playbackpro' };
		window.electron.send('stop-server', JSON.stringify(msg));
	}

	updateLayers(msg: any) {
		const layerNameSplitOne = msg.address.split(':')[1];
		const layerName = layerNameSplitOne.split('/media/')[0];
		const layers = this._layers;

		const layer = layers.find((l) => l.name === layerName);

		if (!layer) {
			const newLayer = {
				name: layerName,
				isVisible: true,
				timeRemaining: 1,
				totalTime: 1,
			};
			const oldLayers = this._layers;
			const newLayers = [...oldLayers, newLayer];

			createMilluminTime(newLayer, this._id);

			this._layers = newLayers;
		}
	}

	updateTimes(msg: any) {
		const timeTotal = msg.args[1].value;
		const timeCurrent = msg.args[0].value;
		const secondsRemaining = timeTotal - timeCurrent;

		const layerNameSplitOne = msg.address.split(':')[1];
		const layerName = layerNameSplitOne.split('/media/')[0];
		const lay = this._layers.find((l) => l.name === layerName);

		if (!lay) {
			return;
		}

		lay.timeRemaining = secondsRemaining;
		lay.totalTime = timeTotal;

		this.setTimes(lay);
	}

	setTimes(layer: any) {
		const l = this._layers.find((lay) => lay.name === layer.name);
		updateMilluminTime(l, this._id);
	}

	handleCheckbox(e: any, layer: any) {
		setTimeVisibility(this._id, e.target.checked, layer.name);
	}
}
