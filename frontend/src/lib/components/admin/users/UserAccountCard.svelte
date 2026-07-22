<script>
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	import UserRoleBadge from './UserRoleBadge.svelte';
	import UserStatusBadge from './UserStatusBadge.svelte';
	import EditRoleDialog from './EditRoleDialog.svelte';

	let {
		user,
		roles,
		onRoleUpdated = () => {}
	} = $props();

	const formatter = new Intl.DateTimeFormat('en-IN', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
</script>

<Card>
	<CardHeader>
		<div class="flex items-center justify-between">
			<CardTitle>Account Information</CardTitle>

			<EditRoleDialog
				userId={user.id}
				currentRole={user.role}
				{roles}
				onUpdated={onRoleUpdated}
			/>
		</div>
	</CardHeader>

	<CardContent class="space-y-6">
		<div>
			<p class="mb-1 text-sm font-medium text-muted-foreground">
				Role
			</p>

			<UserRoleBadge role={user.role.name} />
		</div>

		<div>
			<p class="mb-1 text-sm font-medium text-muted-foreground">
				Status
			</p>

			<UserStatusBadge isActive={user.isActive} />
		</div>

		<div>
			<p class="mb-1 text-sm font-medium text-muted-foreground">
				Last Login
			</p>

			<p>
				{#if user.lastLoginAt}
					{formatter.format(new Date(user.lastLoginAt))}
				{:else}
					Never
				{/if}
			</p>
		</div>
	</CardContent>
</Card>