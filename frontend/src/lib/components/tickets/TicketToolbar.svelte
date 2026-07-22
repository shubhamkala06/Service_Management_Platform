<script>
	import { Funnel, Plus, Search } from 'lucide-svelte';
</script>

<div class="flex items-center justify-between">

	<div>
		<h1 class="text-2xl font-bold text-slate-900">
			Tickets
		</h1>

		<p class="mt-0.5 text-xs text-slate-500">
			Manage and track all service desk tickets.
		</p>
	</div>

	<button
		type="button"
		class="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
	>
		<Plus size={18} />

		Create Ticket
	</button>

</div>

<div class="mt-6 flex flex-wrap items-center gap-3">

	<div class="relative flex-1 min-w-80">

		<Search
			size={18}
			class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
		/>

		<input
			type="text"
			placeholder="Search tickets..."
			class="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500"
		/>

	</div>

	<button
		type="button"
		class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
	>
		<Funnel size={18} />

		Filters
	</button>

</div>