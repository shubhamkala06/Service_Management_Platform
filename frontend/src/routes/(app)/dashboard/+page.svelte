<script>
	const cards = [
		{
			title: 'My Tickets',
			value: '12'
		},
		{
			title: 'Assigned Assets',
			value: '14'
		},
		{
			title: 'Open Requests',
			value: '5'
		},
		{
			title: 'Recent Activity',
			value: '—'
		}
	];
</script>

<section class="space-y-8 p-8">

	<div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

		{#each cards as card (card.title)}

			<div
				class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
			>

				<h2 class="text-xs font-semibold uppercase tracking-wide text-slate-500">
					{card.title}
				</h2>

				<p class="mt-5 text-3xl font-bold text-slate-900">
					{card.value}
				</p>

			</div>

		{/each}

	</div>

</section>