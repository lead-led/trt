import { deletePlaybackProInstance } from '$lib/controllers/instances_controller';
import type { PlaybackObject } from '$lib/types';
import { nanoid } from 'nanoid';

declare let window: any;

export class PlaybackInstance {
	protected _id = nanoid();
	protected _index: number;
	protected _port = $state('8000');
	protected _ip = $state('127.0.0.1');
	protected _isConnected = $state(false);
	protected _layers = $state<any[]>([]);
	protected _localServerStatus = $state<'running' | 'stopped'>('stopped');
	protected _isLocalServerRunning = $state(false);
	protected _runningServerAddress = $state('');
	protected _timeLeftInSeconds = $state<number | null>(null);
	protected _timeElapsedInSeconds = $state<number | null>(null);
	protected _timeRemaining = $state<number | null>(null);
	protected _totalTime = $state<number | null>(null);
	protected _isVisible = $state(true);
	protected _name = $state('Playback Pro');
	protected _cueTimeLeft = $state<string | null>(null);
	protected _cueTimeElapsed = $state<string | null>(null);
	protected _localIp = $state('127.0.0.1');
	protected _label = $state('');

	constructor(newIndex: number) {
		this._index = newIndex;
	}

	get localServerStatus() {
		return this._localServerStatus;
	}

	get localIp() {
		return this._localIp;
	}

	get timeLeftInSeconds() {
		return this._timeLeftInSeconds;
	}

	get timeElapsedInSeconds() {
		return this._timeElapsedInSeconds;
	}

	get timeRemaining() {
		return this._timeRemaining;
	}

	get totalTime() {
		return this._totalTime;
	}

	get name() {
		return this._name;
	}

	get label() {
		return this._label;
	}

	set label(newLabel: string) {
		this._label = newLabel;
	}

	get displayName() {
		return this.label ? `${this._name} - ${this.label}` : this._name;
	}

	get id() {
		return this._id;
	}

	get index() {
		return this._index;
	}

	get port() {
		return this._port;
	}

	get ip() {
		return this._ip;
	}

	get isConnected() {
		return this._isConnected;
	}

	get layers() {
		return this._layers;
	}

	get isLocalServerRunning() {
		return this._isLocalServerRunning;
	}

	get runningServerAddress() {
		return this._runningServerAddress;
	}

	get cueTimeLeft() {
		return this._cueTimeLeft;
	}

	get cueTimeElapsed() {
		return this._cueTimeElapsed;
	}

	get thisObj(): PlaybackObject {
		return {
			id: this.id,
			port: this.port,
			name: this.displayName,
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
			label: this.label,
			displayName: this.displayName,
		};
	}

	setLocalServerStatus(msg: { isRunning: boolean; address: string }) {
		const { isRunning, address } = msg;
		this._isLocalServerRunning = isRunning;

		if (this._isLocalServerRunning) {
			this._localServerStatus = 'running';
			this._runningServerAddress = address;
		} else {
			this._localServerStatus = 'stopped';
			this._runningServerAddress = '';
		}
	}

	protected deleteBackendObject() {
		window.electron.send('delete-backend-object', JSON.stringify(this.thisObj));
	}

	deleteInstance(): void {
		this.deleteBackendObject();
		deletePlaybackProInstance(this.id);
	}
}
