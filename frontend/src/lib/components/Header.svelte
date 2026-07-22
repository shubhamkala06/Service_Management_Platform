<script>
	import { Bell, LogOut } from 'lucide-svelte';

	import { auth } from '$lib/stores/auth.svelte';
	import { page } from '$lib/stores/page.svelte';

	function logout() {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/logout`;
	}

	const initials = $derived.by(() => {
		if (!auth.user) {
			return '';
		}

		return `${auth.user.firstName[0]}${auth.user.lastName[0]}`;
	});
</script>

<header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
	<div>
		<h1 class="text-2xl font-bold text-slate-900">
			{page.title}
		</h1>

		{#if page.subtitle}
			<p class="mt-0.5 text-xs text-slate-500">
				{page.subtitle}
			</p>
		{/if}
	</div>

	<div class="flex items-center gap-6">
		<button
			type="button"
			aria-label="Notifications"
			class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
		>
			<Bell size={20} />
		</button>

		<div class="flex items-center gap-3">
			<div
				class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
			>
				{initials}
			</div>

			<div>
				<p class="text-sm font-semibold text-slate-900">
					{auth.user.firstName}
					{auth.user.lastName}
				</p>

				<p class="text-xs text-slate-500">
					{auth.user.email}
				</p>
			</div>
		</div>

		<button
			type="button"
			onclick={logout}
			class="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
		>
			<LogOut size={16} />
			<span>Logout</span>
		</button>
	</div>
</header>