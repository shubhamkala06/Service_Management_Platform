<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import Header from '$lib/components/Header.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	import { getCurrentUser } from '$lib/api/user';
	import { auth } from '$lib/stores/auth.svelte';

	let { children } = $props();

	onMount(async () => {
		try {
			const user = await getCurrentUser();

			auth.setUser(user);
		} catch (err) {
			auth.clearUser();

			goto('/login', {
				replaceState: true
			});
		}
	});
</script>

{#if auth.isLoading}
	<div class="flex h-screen items-center justify-center bg-slate-50">
		<p class="text-sm text-slate-500">Loading...</p>
	</div>
{:else}
	<div class="flex h-screen bg-slate-50">
		<Sidebar role={auth.user?.role?.name} />

		<div class="flex min-w-0 flex-1 flex-col">
			<Header />

			<main class="flex-1 overflow-y-auto p-8">
				{@render children()}
			</main>
		</div>
	</div>
{/if}
