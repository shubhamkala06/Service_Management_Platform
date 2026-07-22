<script>
	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	const role = 'SYSTEM_ADMINISTRATOR';

	let { children } = $props();
</script>

<div class="flex h-screen bg-slate-50">
	<Sidebar {role} />

	<div class="flex min-w-0 flex-1 flex-col">
		<Header />

		<main class="flex-1 overflow-y-auto p-8">
			{@render children()}
		</main>
	</div>
</div>
