<script>
	import { goto } from '$app/navigation';

	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';

	import UserRoleBadge from './UserRoleBadge.svelte';
	import UserStatusBadge from './UserStatusBadge.svelte';

	let { users = [] } = $props();

	function viewUser(id) {
		goto(`/admin/users/${id}`);
	}
</script>

<Table.Root>
	<Table.Caption>Platform users</Table.Caption>

	<Table.Header>
		<Table.Row>
			<Table.Head>Name</Table.Head>
			<Table.Head>Email</Table.Head>
			<Table.Head>Department</Table.Head>
			<Table.Head>Role</Table.Head>
			<Table.Head>Status</Table.Head>
			<Table.Head class="text-right">Action</Table.Head>
		</Table.Row>
	</Table.Header>

	<Table.Body>
		{#each users as user (user.id)}
			<Table.Row>
				<Table.Cell>
					<div class="flex flex-col">
						<span class="font-medium text-slate-900">
							{user.firstName}
							{user.lastName}
						</span>
					</div>
				</Table.Cell>

				<Table.Cell>{user.email}</Table.Cell>

				<Table.Cell>
					{user.department ?? '—'}
				</Table.Cell>

				<Table.Cell>
					<UserRoleBadge role={user.role?.name} />
				</Table.Cell>

				<Table.Cell>
					<UserStatusBadge isActive={user.isActive} />
				</Table.Cell>

				<Table.Cell class="text-right">
					<Button variant="outline" size="sm" onclick={() => viewUser(user.id)}>View</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
