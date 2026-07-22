<script>
	import { Bell } from 'lucide-svelte';
</script>

<header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">

	<div>
		<h1 class="text-2xl font-bold text-slate-900">
			Dashboard
		</h1>

		<p class="mt-0.5 text-xs text-slate-500">
			Overview
		</p>
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
				A
			</div>

			<div>
				<p class="text-sm font-semibold text-slate-900">
					Administrator
				</p>

				<p class="text-xs text-slate-500">
					admin@example.com
				</p>
			</div>

		</div>

	</div>

</header>