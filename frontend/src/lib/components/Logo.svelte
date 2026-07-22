<script>
	let { variant = 'horizontal' } = $props();
</script>

{#if variant === 'horizontal'}
	<div class="flex items-center gap-4">
		<div
			class="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-slate-700 px-3"
		>
			<span class="text-xl font-bold tracking-tight">
				S<span class="text-emerald-500">A</span>M
			</span>
		</div>

		<div>
			<h1 class="text-xl font-bold text-slate-900">Service Desk</h1>

			<p class="text-xs text-slate-500">Asset Management Platform</p>
		</div>
	</div>
{:else}
	<div class="flex flex-col items-center">
		<div
			class="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-slate-700 px-4"
		>
			<span class="text-2xl font-bold tracking-tight">
				S<span class="text-emerald-500">A</span>M
			</span>
		</div>

		<h1 class="mt-5 text-3xl font-bold text-slate-900">Service Desk</h1>

		<p class="mt-1 text-sm text-slate-500">Asset Management Platform</p>
	</div>
{/if}
