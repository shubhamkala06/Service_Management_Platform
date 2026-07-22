<script>
	import { page } from '$lib/stores/page.svelte';

	page.setPage({
		title: 'Dashboard',
		subtitle: 'Overview'
	});
</script>

<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
	<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">My Tickets</p>

		<p class="mt-3 text-2xl font-bold text-slate-900">1</p>

		<p class="mt-3 text-sm text-slate-500"></p>
	</div>

	<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Assigned Assets</p>

		<p class="mt-3 text-2xl font-bold text-slate-900">—</p>

		<p class="mt-3 text-sm text-slate-500"></p>
	</div>

	<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Open Requests</p>

		<p class="mt-3 text-2xl font-bold text-slate-900">—</p>

		<p class="mt-3 text-sm text-slate-500"></p>
	</div>

	<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent Activity</p>

		<p class="mt-3 text-2xl font-bold text-slate-900">—</p>

		<p class="mt-3 text-sm text-slate-500"></p>
	</div>
</div>
