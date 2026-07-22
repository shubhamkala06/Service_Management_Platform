<script>
	const columns = [
		'Ticket No',
		'Subject',
		'Status',
		'Priority',
		'Requester',
		'Assignee',
		'Created'
	];
</script>

<div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

	<table class="min-w-full">

		<thead class="border-b border-slate-200 bg-slate-50">

			<tr>

				{#each columns as column}

					<th
						class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
					>
						{column}
					</th>

				{/each}

			</tr>

		</thead>

		<tbody>

			<tr>

				<td
					colspan={columns.length}
					class="px-6 py-20 text-center"
				>

					<p class="text-base font-semibold text-slate-700">
						No tickets found
					</p>

					<p class="mt-2 text-sm text-slate-500">
						Create your first ticket to get started.
					</p>

				</td>

			</tr>

		</tbody>

	</table>

</div>