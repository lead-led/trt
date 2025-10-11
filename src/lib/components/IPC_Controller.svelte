<script lang="ts">
	import { browser } from '$app/environment';
	import { setIps } from '$lib/stores/local.svelte';
	import {
		handleServerStatusMessage,
		handleServerDataMessage,
	} from '$lib/controllers/instances_controller';
	import { setDevMode } from '$lib/stores/app';

	if (window.electron && browser) {
		window.electron.receive('local-server-status', (data: any) => {
			handleServerStatusMessage(data);
		});

		window.electron.receive('osc-msg', (data: any) => {
			handleServerDataMessage(data);
		});

		window.electron.receive('ips', (data: any) => {
			setIps(data);
		});

		window.electron.send('has-loaded', true);

		window.electron.receive('is-dev', (data: any) => {
			setDevMode(Boolean(data));
		});
	}
</script>
