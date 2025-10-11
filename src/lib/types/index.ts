import type { MilluminInstance } from '$lib/classes/millumin_instance';
import type { MittiInstance } from '$lib/classes/mitti_instance';
import type { PlaybackProInstance } from '$lib/classes/playbackpro_instance';

export interface MilluminLayer {
	name: string;
	isVisible: boolean;
	timeRemaining: number;
	totalTime: number;
}

export interface LayerState {
	name: string;
	timeRemaining: number;
	totalTime: number;
	times: {
		frames: string;
		seconds: string;
		minutes: string;
		hours: string;
	};
	isVisible: boolean;
}

export type InstanceType = 'millumin' | 'mitti' | 'playbackpro';

export interface ServerStatusMessage {
	running: boolean;
	id: string;
	type: InstanceType;
}

export interface ServerDataMessage {
	id: string;
	type: InstanceType;
	data: string;
}

interface Time {
	totalTime: number;
	timeRemaining: number;
	running: boolean;
	seconds: number;
	minutes: number;
	hours: number;
}

export interface NewTimeInput {
	id: string;
	name: string;
	timeRemaining: number;
	totalTime: number;
	isVisible: boolean;
	instance?: MittiInstance | MilluminInstance | PlaybackProInstance;
	running: boolean;
}

export interface PlaybackObject {
	id: string;
	name: string;
	port: string;
	localIp: string;
	isConnected: boolean;
	isLocalServerRunning: boolean;
	localServerStatus: string;
	timeRemaining: number | null;
	totalTime: number | null;
	layers: LayerState[];
	index: number;
	type: InstanceType;
	isVisible: boolean;
	timeLeftInSeconds?: number | null;
	label?: string;
	displayName?: string;
}
