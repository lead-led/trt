<script lang="ts">
	let { index = 0 } = $props();

	import { TextInput, NumberInput, Tile, Button, Checkbox } from 'carbon-components-svelte';

	import {
		playbackProInstances,
		isPortOnIpAvailable,
	} from '$lib/controllers/instances_controller';
	import { slide } from 'svelte/transition';
	import type { PlaybackProInstance } from '$lib/classes/playbackpro_instance';

const instanceObj: PlaybackProInstance = $playbackProInstances[index];

const displayName = $derived(instanceObj.displayName);
const port = $derived(instanceObj.port);
const localIp = $derived(instanceObj.ip);
const isLocalServerRunning = $derived(instanceObj.isLocalServerRunning);
const localServerStatus = $derived(instanceObj.localServerStatus);
const layers = $derived(instanceObj.layers);
const runningServerAddress = $derived(instanceObj.runningServerAddress);

	const setIP = () => {
		instanceObj.setIP(_ip);
	};

	const setPort = () => {
		instanceObj.setPort(_port.toString());
	};

	const connect = () => {
		if (!isPortOnIpAvailable(_port, _ip)) {
			alert('Port is already in use');
			return;
		}
		instanceObj.startLocalServer(_port);
	};

	const stopServer = () => {
		instanceObj.stopLocalServer();
	};

	const deleteInstance = () => {
		instanceObj.deleteInstance();
	};

	let _port = $state(4647);
	let _ip = $state('127.0.0.1');
	let isOpen = $state(false);
</script>

<div class="container">
	<button type="button" class="title-container" onclick={() => (isOpen = !isOpen)}>
		<h5 class="title">{displayName}</h5>

		<div class="server-status">
			{localServerStatus}
			{#if isLocalServerRunning}
				<div class="status-circle isRunning"></div>
			{:else}
				<div class="status-circle"></div>
			{/if}
		</div>
	</button>

	{#if isOpen}
		<br />
		<div class="body" transition:slide|global={{ duration: 100 }}>
			<Tile>
				<div class="row-container">
					<TextInput
						labelText="Label"
						placeholder="Optional label"
						bind:value={instanceObj.label}
					/>
				</div>

				<br />

				<div>Local IP : {localIp ? localIp : 'n/a'}</div>
				<div>Local Port : {port ? port : 'n/a'}</div>

				{#if isLocalServerRunning}
					<div>Server Address : {runningServerAddress}</div>
				{:else}
					<div>Server Address : n/a</div>
				{/if}
			</Tile>

			<br />

			<Tile>
				<h5>TCP Connection Setup</h5>

				<br />

				<div class="row-container">
					<TextInput
						labelText="Playback Pro IP Address"
						placeholder="The IP address of Playback Pro computer"
						bind:value={_ip}
						onchange={setIP}
					/>
				</div>

				<br />

				<div class="row-container">
					<NumberInput
						min={4000}
						max={50000}
						bind:value={_port}
						onchange={setPort}
						invalidText="Number must be between 4000 and 50000."
						label="Port Number"
					/>
				</div>

				<br />

				<div class="row-container">
					<Button onclick={connect} size="field" disabled={isLocalServerRunning}>
						Connect
					</Button>
					<Button onclick={stopServer} size="field" kind="danger-tertiary">
						Stop
					</Button>
				</div>
			</Tile>

			<br />

			<div class="remove-container">
				<Button size="field" kind="danger-tertiary" onclick={deleteInstance}>
					Remove Instance
				</Button>
			</div>

			<br />

			{#if layers.length}
				<Tile>
					<h5>Toggle Layers</h5>
					{#each layers as layer}
					<Checkbox
						labelText={layer.name}
						bind:checked={layer.isVisible}
						onchange={(checkbox) => instanceObj.handleCheckbox(checkbox, layer)}
					/>
					{/each}
				</Tile>
			{/if}
		</div>
	{/if}
</div>

<style>
	.title-container {
		background: none;
		border: none;
		padding: 0;
		color: inherit;
		font: inherit;
		display: flex;
		justify-content: space-between;
		cursor: pointer;
	}
	.container {
		border: solid 1px white;
		padding: 10px;
	}
	.server-status {
		display: flex;
	}
	.status-circle {
		width: 10px;
		height: 10px;
		background: red;
		border-radius: 50%;
		margin-top: 4px;
		margin-left: 8px;
	}
	.isRunning {
		background: rgb(0, 255, 0);
	}
</style>
