import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

import { MilluminInstance } from '$lib/classes/millumin_instance';
import { MittiInstance } from '$lib/classes/mitti_instance';
import { PlaybackProInstance } from '$lib/classes/playbackpro_instance';

import type {
	ServerStatusMessage,
	ServerDataMessage,
	NewTimeInput,
	MilluminLayer,
} from '$lib/types';

import { TimeObj } from '$lib/classes/time';

export const milluminInstances: Writable<MilluminInstance[]> = writable([]);

export const mittiInstances: Writable<MittiInstance[]> = writable([]);

export const playbackProInstances: Writable<PlaybackProInstance[]> = writable([]);

export const times: Writable<TimeObj[]> = writable([]);

export const addPlaybackOptions: Writable<any[]> = writable([
	{
		name: 'Mitti',
		add: addMittiInstance,
	},
	{
		name: 'Millumin',
		add: addMilluminInstance,
	},
	{
		name: 'Playback Pro',
		add: addPlaybackProInstance,
	},
]);

export function setTimeVisibility(id: string, isVisible: boolean, layerName: string) {
	times.update((currentTimes) =>
		currentTimes.map((time) =>
			time.id === id && time.name === layerName ? time.withUpdates({ isVisible }) : time
		)
	);
}

export function createMittiTime(instance: MittiInstance['thisObj']) {
	const { name, timeRemaining, totalTime, isVisible, id } = instance;

	const timeInput: NewTimeInput = {
		id,
		name,
		timeRemaining: timeRemaining || 0,
		totalTime: totalTime || 0,
		isVisible,
		running: true,
		// @ts-ignore
		instance,
	};

	const newTime = new TimeObj(timeInput);
	const oldTimes = get(times);
	const newTimes = [...oldTimes, newTime];
	times.set(newTimes);
}

export function createMilluminTime(layer: MilluminLayer, id: string) {
	const { timeRemaining, totalTime, name, isVisible } = layer;

	if (!layer.name) return;

	const timeInput: NewTimeInput = {
		id,
		name: layer.name,
		timeRemaining,
		totalTime,
		isVisible,
		running: true,
		// @ts-ignore
		instance: layer,
	};

	const newTime = new TimeObj(timeInput);
	const oldTimes = get(times);
	const newTimes = [...oldTimes, newTime];
	times.set(newTimes);
}

export function updateMilluminTime(layer: MilluminLayer, id: string) {
	times.update((currentTimes) =>
		currentTimes.map((time) =>
			time.id === id && time.name === layer.name
				? time.withUpdates({
						timeRemaining: layer.timeRemaining,
						totalTime: layer.totalTime,
						isVisible: layer.isVisible,
					})
				: time
		)
	);
}

export function updateMittiTime(layer: MittiInstance['thisObj'], id: string) {
	times.update((currentTimes) =>
		currentTimes.map((time) =>
			time.id === id && time.name === layer.name
				? time.withUpdates({
						timeRemaining: layer.timeRemaining ?? time.timeRemaining,
						totalTime: layer.totalTime ?? time.totalTime,
						isVisible: layer.isVisible ?? time.isVisible,
					})
				: time
		)
	);
}

export function handleMittiTime(instance: MittiInstance['thisObj']) {
	const { id } = instance;

	if (!id) return;

	const exists = get(times).find((time) => time.id === id);

	if (exists) {
		updateMittiTime(instance, id);
		return;
	}

	createMittiTime(instance);
}

export function deleteTime(id: string) {
	const newTimes = get(times).filter((time) => time.instance?.id !== id);
	times.set(newTimes);
}

export function createPlaybackProTime(instance: PlaybackProInstance['thisObj']) {
	const { name, timeRemaining, totalTime, isVisible, id } = instance;

	const timeInput: NewTimeInput = {
		id,
		name,
		timeRemaining: timeRemaining || 0,
		totalTime: totalTime || 0,
		isVisible,
		running: true,
		// @ts-ignore
		instance,
	};

	const newTime = new TimeObj(timeInput);
	const oldTimes = get(times);
	const newTimes = [...oldTimes, newTime];
	times.set(newTimes);
}

export function updatePlaybackProTime(instance: PlaybackProInstance['thisObj'], id: string) {
	times.update((currentTimes) =>
		currentTimes.map((time) =>
			time.id === id && time.name === instance.name
				? time.withUpdates({
						timeRemaining: instance.timeRemaining ?? time.timeRemaining,
						totalTime: instance.totalTime ?? time.totalTime,
						isVisible: instance.isVisible ?? time.isVisible,
					})
				: time
		)
	);
}

export function handlePlaybackProTime(instance: PlaybackProInstance['thisObj']) {
	const { id } = instance;

	if (!id) return;

	const exists = get(times).find((time) => time.id === id);

	if (exists) {
		updatePlaybackProTime(instance, id);
		return;
	}

	createPlaybackProTime(instance);
}

export function addMilluminInstance() {
	const newIndex = get(milluminInstances).length;
	const newInstance = new MilluminInstance(newIndex);
	milluminInstances.update(() => [...get(milluminInstances), newInstance]);
}

export function addMittiInstance() {
	const newIndex = get(mittiInstances).length;
	const newInstance = new MittiInstance(newIndex);

	mittiInstances.update(() => [...get(mittiInstances), newInstance]);
}

export function addPlaybackProInstance() {
	const newIndex = get(playbackProInstances).length;
	const newInstance = new PlaybackProInstance(newIndex);
	playbackProInstances.update(() => [...get(playbackProInstances), newInstance]);
}

export function deleteMittiInstance(id: string) {
	get(times).forEach((t) => {
	});
	deleteTime(id);
	const newInstances = get(mittiInstances).filter((instance) => instance.id !== id);
	mittiInstances.set(newInstances);
}

export function removeMilluminLayerTime(id: string, layerName: string) {
	times.update((currentTimes) =>
		currentTimes.filter((time) => !(time.id === id && time.name === layerName)),
	);
}

export function deleteMilluminInstance(id: string) {
	deleteTime(id);
	const newInstances = get(milluminInstances).filter((instance) => instance.id !== id);
	milluminInstances.set(newInstances);
}

export function deletePlaybackProInstance(id: string) {
	deleteTime(id);
	const newInstances = get(playbackProInstances).filter((instance) => instance.id !== id);
	playbackProInstances.set(newInstances);
}

export function handleServerStatusMessage(msg: any) {
	msg = JSON.parse(msg) as ServerStatusMessage;
	if (msg.type === 'millumin') {
		const milluminInstance = get(milluminInstances).find((instance) => instance.id === msg.id);
		if (milluminInstance) {
			milluminInstance.setLocalServerStatus(msg);
		}
	}
	if (msg.type === 'mitti') {
		const mittiInstance = get(mittiInstances).find((instance) => instance.id === msg.id);
		if (mittiInstance) {
			mittiInstance.setLocalServerStatus(msg);
		}
	}
	if (msg.type === 'playbackpro') {
		const playbackProInstance = get(playbackProInstances).find(
			(instance) => instance.id === msg.id,
		);
		if (playbackProInstance) {
			playbackProInstance.setLocalServerStatus(msg);
		}
	}
}

export function handleServerDataMessage(msg: any) {
	msg = JSON.parse(msg) as ServerDataMessage;
	if (msg.type === 'millumin') {
		const milluminInstance = get(milluminInstances).find((instance) => instance.id === msg.id);
		if (milluminInstance) {
			milluminInstance.handleNewMessage(msg.data);
		}
	}
	if (msg.type === 'mitti') {
		const mittiInstance = get(mittiInstances).find((instance) => instance.id === msg.id);
		if (mittiInstance) {
			mittiInstance.handleNewMessage(msg.data);
		}
	}
	if (msg.type === 'playbackpro') {
		const playbackProInstance = get(playbackProInstances).find(
			(instance) => instance.id === msg.id,
		);
		if (playbackProInstance) {
			playbackProInstance.handleNewMessage(msg.data);
		}
	}
}

export function isPortOnIpAvailable(port: number, ip: string) {
	const incomingAddress = `${ip}:${port}`;

	for (const millumin of get(milluminInstances)) {
		if (incomingAddress === millumin.runningServerAddress) {
			return false;
		}
	}
	for (const mitti of get(mittiInstances)) {
		if (incomingAddress === mitti.runningServerAddress) {
			return false;
		}
	}
	return true;
}
