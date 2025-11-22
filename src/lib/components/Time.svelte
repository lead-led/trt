<script lang="ts">
	let { time } = $props<{ time: any }>();

	import { tweened } from 'svelte/motion';
	import { appState } from '$lib/stores/app';

	let previousTime = { hours: '00', minutes: '00', seconds: '00' };
	let isTimerStatic = $state(false);

	const checkTimerStatic = () => {
		if (
			time.hours === previousTime.hours &&
			time.minutes === previousTime.minutes &&
			time.seconds === previousTime.seconds
		) {
			// @ts-ignore
			previousTime.hours = '00';
			// @ts-ignore
			previousTime.minutes = '00';
			// @ts-ignore
			previousTime.seconds = '00';

			time.hours = '00';
			time.minutes = '00';
			time.seconds = '00';
			isTimerStatic = true;
		} else {
			isTimerStatic = false;
			previousTime = {
				hours: time.hours,
				minutes: time.minutes,
				seconds: time.seconds,
			};
		}
	};

	setInterval(checkTimerStatic, 1200);
	const opacity = $derived(isTimerStatic ? 0.1 : 1);

	const progress = tweened(0, {
		duration: 100,
	});

	type TimeStatus = 'default' | 'warning' | 'critical';

	let timeStatus = $state<TimeStatus>('default');
	let backgroundColor = $state('green');
	let textColor = $state('white');

	$effect(() => {
		const seconds = Number(time.seconds);
		const minutes = Number(time.minutes);
		const hours = Number(time.hours);

		if (!Number.isFinite(seconds) || !Number.isFinite(minutes) || !Number.isFinite(hours)) {
			timeStatus = 'default';
			return;
		}

		if (hours === 0 && minutes === 0 && seconds < 11) {
			timeStatus = 'critical';
			return;
		}

		if (hours === 0 && minutes === 0 && seconds < 31) {
			timeStatus = 'warning';
			return;
		}

		timeStatus = 'default';
	});

	$effect(() => {
		if (timeStatus === 'critical') {
			backgroundColor = 'red';
			textColor = 'white';
			return;
		}

		if (timeStatus === 'warning') {
			backgroundColor = 'orange';
			textColor = 'black';
			return;
		}

		backgroundColor = 'green';
		textColor = 'white';
	});

	$effect(() => {
		const { timeRemaining, totalTime } = time;

		if (
			!Number.isFinite(timeRemaining) ||
			!Number.isFinite(totalTime) ||
			totalTime <= 0
		) {
			progress.set(0);
			return;
		}

		const nextWidth = 1 - timeRemaining / totalTime;

		if (Number.isFinite(nextWidth) && nextWidth >= 0 && nextWidth <= 1) {
			progress.set(nextWidth);
		}
	});

</script>

<div class="timer-wrapper">
	<div class="asdf-container">
		{#if appState.isTextOnTop}
			<div
				class="name"
				style={`text-align: ${appState.textAlignment}; font-size: ${appState.labelFontSize}px`}
			>
				{time.name.replace('layer:', '').toUpperCase()}
			</div>
		{/if}

		<div
			class="time-container"
			style={`background: ${backgroundColor}; color: ${textColor}; font-size: ${appState.timeFontSize}px; opacity: ${opacity}`}
		>
			<div class="time-display">
				<span class="time-part">{time.hours}</span><span class="time-separator">:</span
				><span class="time-part">{time.minutes}</span><span class="time-separator">:</span
				><span class="time-part">{time.seconds}</span>
			</div>

			<progress style={`height: ${appState.timeFontSize / 10}px`} value={$progress}></progress>
		</div>

		{#if !appState.isTextOnTop}
			<div
				class="name"
				style={`text-align: ${appState.textAlignment}; font-size: ${appState.labelFontSize}px`}
			>
				{time.name}
			</div>
		{/if}
	</div>
</div>

<style>
	.timer-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1 1 320px;
		max-width: 640px;
		max-height: 90vh;
		width: 100%;
		box-sizing: border-box;
	}
	progress {
		width: 100%;
		position: absolute;
		bottom: 0;
		appearance: none;
	}
	progress::-webkit-progress-bar {
		background-color: #ddd;
	}

	progress::-webkit-progress-value {
		background-color: #00b3ff;
	}

	progress::-moz-progress-bar {
		background-color: #00b3ff;
	}

	.time-container {
		line-height: 1;
		padding-block: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		transition: opacity 0.25s ease-in-out;
		font-variant-numeric: tabular-nums;
		max-width: 100%;
		max-height: 100%;
	}
	.time-display {
		display: flex;
		align-items: center;
	}
	.time-part,
	.time-separator {
		display: inline-flex;
	}
	.asdf-container {
		font-size: 5em;
		padding: 20px;
		outline-width: 2px;
		outline-color: rgba(173, 216, 230, 0);
		outline-style: dashed;
		transition: border-color 0.2s;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		width: 100%;
		max-width: 100%;
		box-sizing: border-box;
	}
</style>
