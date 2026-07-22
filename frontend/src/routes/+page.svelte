<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	onMount(() => {
		goto(resolve('/dashboard'), {
			replaceState: true
		});
	});
</script>
