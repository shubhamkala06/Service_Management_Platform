<script>
	import { Badge } from '$lib/components/ui/badge';

	let { isActive } = $props();
</script>

{#if isActive}
	<Badge
		variant="secondary"
		class="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
	>
		Active
	</Badge>
{:else}
	<Badge variant="secondary" class="border border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
		Inactive
	</Badge>
{/if}
