<script lang="ts">
	import Settings from '$lib/components/Settings.svelte';
	import Format from '$lib/components/Format.svelte';
	import Time from '$lib/components/Time.svelte';
	import IpcController from '$lib/components/IPC_Controller.svelte';
	import Dev from '$lib/components/Dev.svelte';
	import { appState, toggleSettings } from '$lib/stores/app';

	// @ts-ignore
	import SettingsIcon from '~icons/material-symbols/settings-outline';

	import { times } from '$lib/controllers/instances_controller';

	const handleClick = () => {
		settingsButtonOpacity = 0;

		toggleSettings();
	};

	let settingsButtonOpacity = $state(0);
	let ref = $state<NodeJS.Timeout | null>(null);

	const clearSettingsButton = () => {
		ref = setTimeout(() => {
			settingsButtonOpacity = 0;
		}, 700);
	};

	const handleHover = () => {
		settingsButtonOpacity = 1;

		if (ref) {
			clearTimeout(ref);
		}

		clearSettingsButton();
	};
</script>

{#if appState.isDev}
	<Dev />
{/if}

<IpcController />

<main onmousemove={handleHover}>
	<button
		type="button"
		class="settings-container"
		style={`opacity: ${settingsButtonOpacity};`}
		onclick={handleClick}
	>
		{#if !appState.isSettingsOpen}
			<SettingsIcon />
		{/if}
	</button>
	{#if appState.isSettingsOpen}
		<Settings />
	{/if}

	{#if appState.isSettingsOpen}
		<!-- <Format /> -->
	{/if}

	<div class="container">
		{#each $times as time}
			{#if time.isVisible}
				<Time {time} />
			{/if}
		{/each}
	</div>
</main>

<style>
	.settings-container {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font: inherit;
		position: absolute;
		width: 50px;
		height: 50px;
		bottom: 15px;
		right: 15px;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	main {
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}
	.container {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-direction: column;
	}
	:root {
		font-family: 'Overpass', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
			Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		color: white;
		user-select: none;
	}

	:global(::-webkit-scrollbar) {
		display: none; /* Hide the scrollbar completely */
	}

	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>
