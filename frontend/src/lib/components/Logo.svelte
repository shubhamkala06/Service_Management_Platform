<script>
	let { showText = true } = $props();
</script>

<div class="flex items-center gap-3">
	<div
		class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-emerald-700 bg-white shadow-sm"
	>
		<span class="text-base font-bold">
			<span class="text-emerald-700">S</span><span class="text-sky-600">A</span><span class="text-emerald-700">M</span>
		</span>
	</div>

	{#if showText}
		<div class="min-w-0">
			<h1 class="text-xl font-bold text-slate-900">
				Service Desk
			</h1>

			<p class="text-xs text-slate-500">
				Asset Management Platform
			</p>
		</div>
	{/if}
</div>