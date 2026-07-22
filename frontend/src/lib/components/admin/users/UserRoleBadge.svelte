<script>
	import { Badge } from '$lib/components/ui/badge';

	let { role } = $props();

	const roleStyles = {
		'System Administrator':
			'border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50',

		'Support Engineer': 'border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50',

		Manager: 'border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50',

		Employee: 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-100'
	};

	const badgeClass = $derived(roleStyles[role] ?? roleStyles.Employee);
</script>

<Badge variant="secondary" class={badgeClass}>
	{role}
</Badge>
