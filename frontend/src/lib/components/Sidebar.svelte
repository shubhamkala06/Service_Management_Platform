<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	import Logo from '$lib/components/Logo.svelte';
	import { getNavigation } from '$lib/navigation';

	let { role = 'SYSTEM_ADMINISTRATOR' } = $props();

	let navigation = $derived(getNavigation(role));
</script>

<aside class="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">

	<div class="border-b border-slate-200 px-6 py-6">
		<Logo />
	</div>

	<nav class="flex-1 px-4 py-6">

		<ul class="space-y-2">

			{#each navigation as item (item.href)}

				<li>

					<a
						href={resolve(item.href)}
						class={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
							page.url.pathname === resolve(item.href)
								? 'bg-emerald-50 text-emerald-700'
								: 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
						}`}
					>

						<item.icon
							size={20}
							strokeWidth={2}
						/>

						<span>{item.label}</span>

					</a>

				</li>

			{/each}

		</ul>

	</nav>

</aside>