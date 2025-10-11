import type { NewTimeInput } from '$lib/types/index.ts';
import type { MilluminInstance } from './millumin_instance';
import type { MittiInstance } from './mitti_instance';
import type { PlaybackProInstance } from './playbackpro_instance';

export class TimeObj {
	id: string;
	totalTime: number;
	timeRemaining: number;
	running: boolean;
	ms: string = '000';
	seconds: string = '00';
	minutes: string = '00';
	hours: string = '00';
	name: string;
	isVisible: boolean = true;
	instance?: MittiInstance | MilluminInstance | PlaybackProInstance;

	constructor(timeInput: NewTimeInput) {
		this.id = timeInput.id;
		this.totalTime = timeInput.totalTime;
		this.timeRemaining = timeInput.timeRemaining;
		this.running = timeInput.running;
		this.name = timeInput.name;
		this.instance = timeInput.instance;
		this.setTimes();
	}

	setTimes() {
		const safeTimeRemaining = Number.isFinite(this.timeRemaining) ? this.timeRemaining : 0;
		const clampedTimeRemaining = Math.max(0, safeTimeRemaining);
		const totalSeconds = clampedTimeRemaining === 0 ? 0 : Math.ceil(clampedTimeRemaining);

		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		this.ms = '000';
		this.seconds = seconds.toString().padStart(2, '0');
		this.minutes = minutes.toString().padStart(2, '0');
		this.hours = hours.toString().padStart(2, '0');
	}

	toInput(): NewTimeInput {
		return {
			id: this.id,
			name: this.name,
			timeRemaining: this.timeRemaining,
			totalTime: this.totalTime,
			isVisible: this.isVisible,
			instance: this.instance,
			running: this.running,
		};
	}

	withUpdates(updates: Partial<NewTimeInput>) {
		const nextInput: NewTimeInput = {
			...this.toInput(),
			...updates,
		};

		return new TimeObj(nextInput);
	}
}
