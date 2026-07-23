<script>
	import { Badge } from '$lib/components/ui/badge';

	let { role } = $props();

	const roleStyles = {
		'System Administrator':
			'text-purple-700 hover:bg-purple-50',

		'Support Engineer': 'text-blue-700 hover:bg-blue-50',

		'Manager': 'text-amber-700 hover:bg-amber-50',

		'Employee': 'text-slate-700 hover:bg-slate-100'
	};

	const badgeClass = $derived(roleStyles[role] ?? roleStyles.Employee);
</script>

<Badge variant="secondary" class={badgeClass}>
	{role}
</Badge>
