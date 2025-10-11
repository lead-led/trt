<script lang="ts">
	import { TimeObj } from '$lib/classes/time';
	import {
		mittiInstances,
		playbackProInstances,
		times,
		milluminInstances,
		addPlaybackOptions,
	} from '$lib/controllers/instances_controller';
	import { onMount } from 'svelte';

	const devTimeObj = new TimeObj({
		id: '1',
		name: 'Test Name',
		timeRemaining: 302,
		totalTime: 500,
		isVisible: true,
		running: true,
	});

	// times.set([devTimeObj, devTimeObj]);

	onMount(() => {
		if ($mittiInstances.length === 0) {
			$addPlaybackOptions[0].add();
		}
		if ($milluminInstances.length === 0) {
			$addPlaybackOptions[1].add();
		}
		if ($playbackProInstances.length === 0) {
			$addPlaybackOptions[2].add();
		}
	});
</script>
