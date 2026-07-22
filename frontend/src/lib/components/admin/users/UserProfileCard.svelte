<script>
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let { user } = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-IN', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	});

	const fields = $derived([
		{
			label: 'Full Name',
			value: `${user.firstName} ${user.lastName}`
		},
		{
			label: 'Email',
			value: user.email
		},
		{
			label: 'Department',
			value: user.department || '—'
		},
		{
			label: 'Date of Joining',
			value: user.dateOfJoining
				? dateFormatter.format(new Date(user.dateOfJoining))
				: '—'
		}
	]);
</script>

<Card class="h-full">
	<CardHeader>
		<CardTitle>Employee Information</CardTitle>
		<CardDescription>
			Basic employee details.
		</CardDescription>
	</CardHeader>

	<CardContent class="space-y-6">
		{#each fields as field (field.label)}
			<div class="space-y-1">
				<p class="text-sm font-medium text-slate-500">
					{field.label}
				</p>

				<p class="text-sm font-semibold text-slate-900 break-words">
					{field.value}
				</p>
			</div>
		{/each}
	</CardContent>
</Card>