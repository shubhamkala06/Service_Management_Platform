<script>
	import { page as pageStore } from '$lib/stores/page.svelte';

	pageStore.setPage({
		title: 'User Details',
		subtitle: 'Loading user information'
	});
</script>

<p>User Details</p>
