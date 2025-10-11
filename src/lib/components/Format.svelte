<script lang="ts">
	import { Tile, Slider } from 'carbon-components-svelte';

	import { fly } from 'svelte/transition';
	import {
		appState,
		setEditingFormat,
		setTextAlignment,
		setTextOnTop,
	} from '$lib/stores/app';

	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
	};

	let ref: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		// touch dependencies
		appState.labelFontSize;
		appState.timeFontSize;

		if (ref) {
			clearTimeout(ref);
		}

		setEditingFormat(true);

		ref = setTimeout(() => {
			setEditingFormat(false);
		}, 200);

		return () => {
			if (ref) {
				clearTimeout(ref);
				ref = null;
			}
			setEditingFormat(false);
		};
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<main
	onclick={handleClick}
	transition:fly|global={{ x: 100, duration: 200 }}
	class:isEditingFormat={appState.isEditingFormat}
>
	<br />

	<h4>Format</h4>

	<br />

	<Tile>
		<h5>Label Position</h5>
		<div class="label-position-container">
			<div class="left column">
			</div>

		<div class="middle column">
			<div class="top-buttons">
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label above, left aligned"
					onclick={() => {
						setTextOnTop(true);
						setTextAlignment('left');
					}}
				></button>
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label above, centered"
					onclick={() => {
						setTextOnTop(true);
						setTextAlignment('center');
					}}
				></button>
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label above, right aligned"
					onclick={() => {
						setTextOnTop(true);
						setTextAlignment('end');
					}}
				></button>
			</div>

				<div class="time">00:00:00</div>

			<div class="bottom-buttons">
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label below, left aligned"
					onclick={() => {
						setTextOnTop(false);
						setTextAlignment('left');
					}}
				></button>
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label below, centered"
					onclick={() => {
						setTextOnTop(false);
						setTextAlignment('center');
					}}
				></button>
				<button
					type="button"
					class="text-position-button"
					aria-label="Set label below, right aligned"
					onclick={() => {
						setTextOnTop(false);
						setTextAlignment('end');
					}}
				></button>
			</div>
			</div>
			<div class="right column"></div>
		</div>
	</Tile>

	<br />

	<Tile>
		<h5>Font Sizes</h5>
		<br />
		<Slider labelText="Time" bind:value={appState.timeFontSize} min={8} max={350} />
		<Slider labelText="Label" bind:value={appState.labelFontSize} />
	</Tile>
</main>

<style>
	.isEditingFormat {
		opacity: 0.1;
	}
	.top-buttons {
		display: flex;
		justify-content: space-between;
	}
	.bottom-buttons {
		display: flex;
		justify-content: space-between;
	}
	.column {
		display: flex;
		flex-direction: column;
	}
	.text-position-button {
		aspect-ratio: 1;
		margin: 5px;
	}
	.time {
		padding: 10px;
		border: 1px solid white;
		margin: 5px;
		justify-content: center;
		display: flex;
	}
	.label-position-container {
		display: grid;
		grid-template-columns: 1fr 3fr 1fr;
	}
	main {
		position: absolute;
		height: 100vh;
		background: rgb(44, 44, 44);
		display: flex;
		flex-direction: column;
		/* width: 300px; */
		padding-inline: 15px;
		font-family: 'Overpass';
		z-index: 2;
		overflow: scroll;
		right: 0;
		transition: opacity 0.3s ease-in-out;
	}
	button {
		padding: 5px;
		padding-inline: 15px;
	}
	button:hover {
		cursor: pointer;
		background: black;
		color: white;
	}
</style>
