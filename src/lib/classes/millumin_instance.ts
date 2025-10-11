import {
	updateMilluminTime,
	createMilluminTime,
	setTimeVisibility,
	deleteMilluminInstance,
} from '$lib/controllers/instances_controller';
import type { MilluminLayer, PlaybackObject } from '$lib/types';
import { PlaybackInstance } from './playback_instance.svelte';

declare let window: any;

export class MilluminInstance extends PlaybackInstance {
	constructor(newIndex: number) {
		super(newIndex);
		this._name = 'Millumin';
		this.initBackendObject();
	}

	get thisObj(): PlaybackObject {
		return {
			id: this.id,
			port: this.port,
			localIp: this.localIp,
			isConnected: this.isConnected,
			isLocalServerRunning: this.isLocalServerRunning,
			localServerStatus: this.localServerStatus,
			layers: this.layers,
			index: this._index,
			type: 'millumin',
			name: this.displayName,
			label: this.label,
			displayName: this.displayName,
			isVisible: this._isVisible,
			totalTime: this._totalTime,
			timeRemaining: this._timeRemaining,
		};
	}

	initBackendObject() {
		window.electron.send('init-backend-object', JSON.stringify(this.thisObj));
	}

	deleteBackendObject() {
		window.electron.send('delete-backend-object', JSON.stringify(this.thisObj));
	}

	startLocalServer(portInput: any) {
		portInput && this.setPort(portInput);

		const msg = {
			port: this._port,
			localIp: this._localIp,
			instanceIndex: this._index,
			id: this._id,
			type: 'millumin',
		};

		if (this.localIp && this.port) {
			window.electron.send('start-server', JSON.stringify(msg));
		}
	}

	stopLocalServer() {
		const msg = { id: this._id, type: 'millumin' };
		window.electron.send('stop-server', JSON.stringify(msg));
	}

	setPort(newPort: string) {
		this._port = newPort;
	}

	setLocalIp(newIp: string) {
		this._localIp = newIp;
	}

	setIsConnected(newStatus: boolean) {
		this._isConnected = newStatus;
	}

	handleNewMessage(msg: any) {
		const layerName = this.getLayerNameFromAddress(msg.address);
		if (!layerName) {
			return;
		}

		this.updateLayers(layerName);

		if (msg.address.includes('/media/time')) {
			this.updateTimes(layerName, msg);
		}
	}

	createLayer(layerName: any) {
		return {
			name: layerName,
			isVisible: true,
			timeRemaining: 1,
			totalTime: 1,
		} as MilluminLayer;
	}

	updateLayers(layerName: string) {
		if (!layerName || layerName === 'layer:states') return;
		const layers = this._layers;

		const layer = layers.find((l) => l.name === layerName);

		if (!layer) {
			const newLayer = this.createLayer(layerName);
			createMilluminTime(newLayer, this._id);

			this._layers = [...layers, newLayer];
		}
	}

	updateTimes(layerName: string, msg: any) {
		const timeTotal = Number(msg?.args?.[1]?.value);
		const timeCurrent = Number(msg?.args?.[0]?.value);

		if (!Number.isFinite(timeTotal) || !Number.isFinite(timeCurrent)) {
			return;
		}

		const secondsRemaining = timeTotal - timeCurrent;

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

		if (!l) return;

		updateMilluminTime(l, this._id);
	}

	handleCheckbox(e: any, layer: any) {
		setTimeVisibility(this._id, e.target.checked, layer.name);
	}

	deleteInstance(): void {
		// send message to stop background services
		this.deleteBackendObject();

		// delete instance object and delete time object
		deleteMilluminInstance(this.id);
	}

	private getLayerNameFromAddress(address: string): string | null {
		if (!address.includes('/millumin/')) {
			return null;
		}

		const segments = address.split('/').filter(Boolean);
		const layerSegment = segments.find((segment) => segment.startsWith('layer:'));

		if (!layerSegment || layerSegment === 'layer:states') {
			return null;
		}

		return layerSegment;
	}
}
