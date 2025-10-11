import {
	setTimeVisibility,
	handleMittiTime,
	deleteMittiInstance,
} from '$lib/controllers/instances_controller';
import { PlaybackInstance } from './playback_instance.svelte';
import type { PlaybackObject } from '$lib/types';

declare let window: any;

export class MittiInstance extends PlaybackInstance {
	constructor(newIndex: number) {
		super(newIndex);
		this._name = 'Mitti';

		this.initBackendObject();
	}

	initBackendObject() {
		window.electron.send('init-backend-object', JSON.stringify(this.thisObj));
	}

	deleteBackendObject() {
		window.electron.send('delete-backend-object', JSON.stringify(this.thisObj));
	}

	get thisObj(): PlaybackObject {
		return {
			id: this.id,
			port: this.port,
			name: this.displayName,
			label: this.label,
			displayName: this.displayName,
			localIp: this.localIp,
			isConnected: this.isConnected,
			isLocalServerRunning: this.isLocalServerRunning,
			localServerStatus: this.localServerStatus,
			timeRemaining: this.timeRemaining,
			totalTime: this.totalTime,
			layers: this.layers,
			index: this.index,
			type: 'mitti',
			isVisible: this._isVisible,
		};
	}

	setPort(port: string) {
		this._port = port;
	}

	setLocalIp(localIp: string) {
		this._localIp = localIp;
	}

	setIsConnected(newStatus: boolean) {
		this._isConnected = newStatus;
	}

	startLocalServer(portInput: any) {
		portInput && this.setPort(portInput);

		const msg = {
			port: this._port,
			localIp: this._localIp,
			instanceIndex: this.index,
			id: this.id,
			type: 'mitti',
		};

		if (this.localIp && this.port) {
			window.electron.send('start-server', JSON.stringify(msg));
		}
	}

	// setLocalServerStatus(msg: any) {
	// 	const { isRunning, address } = msg;
	// 	this._isLocalServerRunning.set(isRunning);

	// 	if (this.isLocalServerRunning) {
	// 		this._localServerStatus.set('running');
	// 		this._runningServerAddress.set(address);
	// 	} else {
	// 		this._localServerStatus.set('stopped');
	// 		this._runningServerAddress.set('');
	// 	}
	// }

	stopLocalServer() {
		const msg = { id: this.id, type: 'mitti' };
		window.electron.send('stop-server', JSON.stringify(msg));
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

		if (this._cueTimeElapsed && this._cueTimeLeft) {
			handleMittiTime(this.thisObj);
		}
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
		let isCueTimeLeft = msg.address.includes('/cueTimeLeft');
		if (!isCueTimeLeft) return;

		const cueTimeLeft = msg.args[0].value;
		this._cueTimeLeft = cueTimeLeft;
	}

	getAndSetCueTimeElapsed(msg: any) {
		let isCueTimeElapsed = msg.address.includes('/cueTimeElapsed');
		if (!isCueTimeElapsed) return;

		const cueTimeElapsed = msg.args[0].value;
		this._cueTimeElapsed = cueTimeElapsed;
	}

	deleteInstance(): void {
		// send message to stop background services
		this.deleteBackendObject();

		// delete instance object and delete time object
		deleteMittiInstance(this.id);
	}

	handleCheckbox(e: any, layer: any) {
		setTimeVisibility(this._id, e.target.checked, layer.name);
	}

	//   {address: '/mitti/time', args: Array(1)}
	// mitti.ts? [sm]:116 {address: '/mitti/cueTimeLeft', args: Array(1)}
	// mitti.ts? [sm]:116 {address: '/mitti/cueTimeElapsed', args: Array(1)}
	// mitti.ts? [sm]:116 {address: '/mitti/playhead', args: Array(1)}
}
