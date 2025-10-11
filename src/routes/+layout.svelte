<script lang="ts">
	import { onMount } from 'svelte';

	import '@fontsource/overpass/200.css';
	import 'carbon-components-svelte/css/g90.css';

	let { children } = $props();
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

{#if ready}
	{@render children?.()}
{/if}

<style>
</style>
