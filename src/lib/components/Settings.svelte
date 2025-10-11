<script>
	import { fly } from 'svelte/transition';
	import { appState, closeSettings } from '$lib/stores/app';
	import { Select, SelectItem, Button } from 'carbon-components-svelte';
	// @ts-ignore
	import CloseIcon from '~icons/material-symbols/cancel-outline-rounded';

	import {
		milluminInstances,
		mittiInstances,
		addPlaybackOptions,
		playbackProInstances,
	} from '$lib/controllers/instances_controller';
	import MilluminInstance from './MilluminInstance.svelte';
	import MittiInstance from './MittiInstance.svelte';
	import PlaybackProInstance from './PlaybackProInstance.svelte';

	const handleCloseClick = () => {
		closeSettings();
	};

	function handleAdd() {
		const option = $addPlaybackOptions.find((opt) => opt.name === value);
		if (option) {
			option.add();
			value = '';
		}
	}

	let value = $state('');
</script>

<main transition:fly|global={{ x: -100, duration: 200 }} class:isEditingFormat={appState.isEditingFormat}>
	<button type="button" class="close-button-container" onclick={handleCloseClick}>
		<CloseIcon />
		<span class="tooltiptext">Close</span>
	</button>

	<div class="container">
		<br />

		<div class="header-container">
			<h4>Playback Instances</h4>
		</div>

		<Select labelText="" bind:selected={value}>
			<SelectItem value="" text="Select Playback Type" />
			{#each $addPlaybackOptions as option}
				<SelectItem value={option.name} text={option.name} />
			{/each}
		</Select>

		<br />

		<Button size="field" onclick={handleAdd} disabled={!value}>Add Instance</Button>

		<br />
		<br />

		<h4>Instances</h4>

		<br />

		{#each $mittiInstances as instance, i}
			<MittiInstance index={i} />
		{/each}

		{#each $milluminInstances as instance, i}
			<MilluminInstance index={i} />
		{/each}

		{#each $playbackProInstances as instance, i}
			<PlaybackProInstance index={i} />
		{/each}
	</div>
</main>

<style>
	.isEditingFormat {
		opacity: 0.1;
	}
	main {
		position: absolute;
		height: 100vh;
		overflow: scroll;
		background: rgb(44, 44, 44);
		min-width: 400px;
		padding-inline: 15px;
		font-family: 'Overpass';
		z-index: 2;
		overflow: scroll;
		transition: opacity 0.3s ease-in-out;
	}

	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close-button-container {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font: inherit;
		position: fixed;
		width: 50px;
		height: 50px;
		left: 400px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.close-button-container:hover .tooltiptext {
		visibility: visible;
	}

	.tooltiptext {
		visibility: hidden;
		width: 120px;
		background-color: rgb(88, 88, 88);
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 6px;
		position: absolute;
		z-index: 10000;
		left: 105%;
	}
</style>
