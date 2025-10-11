<script lang="ts">
	let { index = 0 } = $props();

	import { Select, SelectItem, NumberInput, Tile, Button, TextInput } from 'carbon-components-svelte';

	import {
		deleteTime,
		isPortOnIpAvailable,
		mittiInstances,
	} from '$lib/controllers/instances_controller';
	import { ips } from '$lib/stores/local.svelte';
	import { slide } from 'svelte/transition';
	import type { MittiInstance } from '$lib/classes/mitti_instance';

	const instanceObj: MittiInstance = $mittiInstances[index];

const displayName = $derived(instanceObj.displayName);
const port = $derived(instanceObj.port);
const localIp = $derived(instanceObj.localIp);
const isLocalServerRunning = $derived(instanceObj.isLocalServerRunning);
const localServerStatus = $derived(instanceObj.localServerStatus);
const layers = $derived(instanceObj.layers);
const runningServerAddress = $derived(instanceObj.runningServerAddress);

	const setNIC = () => {
		instanceObj.setLocalIp(_nic);
	};

	const setPort = () => {
		instanceObj.setPort(_port.toString());
	};

	const startServer = () => {
		if (!isPortOnIpAvailable(_port, _nic)) {
			alert('Port is already in use');
			return;
		}
		instanceObj.startLocalServer(_port);
	};

	const stopServer = () => {
		instanceObj.stopLocalServer();
		deleteTime(instanceObj.id);
	};

	const deleteInstance = () => {
		instanceObj.deleteInstance();
	};

	let _port = $state(1234);
	let _nic = $state('');
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
				<h5>Server Setup</h5>

				<br />

				<div class="row-container">
					<Select labelText="NIC" bind:selected={_nic} onchange={setNIC}>
						{#each ips as ip}
							<SelectItem value={ip.address} text={`${ip.nic}: ${ip.address}`} />
						{/each}
					</Select>
				</div>

				<br />

				<div class="row-container">
					<NumberInput
						min={1234}
						max={50000}
						bind:value={_port}
						onchange={setPort}
						invalidText="Number must be between 4000 and 50000."
						label="Port Number"
					/>
				</div>

				<br />

				<div class="row-container">
					<Button onclick={startServer} size="field" disabled={isLocalServerRunning}>
						Start Server
					</Button>
					<Button
						onclick={stopServer}
						size="field"
						kind="danger-tertiary"
						disabled={!isLocalServerRunning}
					>
						Stop Server
					</Button>
				</div>

				<br />

				<div class="remove-container">
					<Button size="field" kind="danger-tertiary" onclick={deleteInstance}>
						Remove Instance
					</Button>
				</div>

				<br />

				{#if layers.length}
					<h3 transition:slide|global>Toggle Layers</h3>
					{#each layers as layer}
						<div class="row-container checkbox-container">
							<input
								type="checkbox"
								class="checkbox"
								checked={layer.isVisible}
								onchange={(checkbox) => {
									instanceObj.handleCheckbox(checkbox, layer);
								}}
							/>
							<label for="checkbox">{layer.name}</label>
						</div>
						<br />
					{/each}
				{/if}
			</Tile>
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
