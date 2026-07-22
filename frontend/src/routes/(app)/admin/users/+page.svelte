<script>
	import { Search, TriangleAlert, Users } from 'lucide-svelte';

	import { getUsers } from '$lib/api/user';

	import UsersTable from '$lib/components/admin/users/UsersTable.svelte';

	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { page as pageStore } from '$lib/stores/page.svelte';

	pageStore.setPage({
		title: 'Users',
		subtitle: 'Manage platform users'
	});

	let users = $state([]);
	let search = $state('');

	let isLoading = $state(true);
	let error = $state(null);

	const filteredUsers = $derived.by(() => {
		const query = search.trim().toLowerCase();

		if (!query) return users;

		return users.filter((user) => {
			const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

			return (
				fullName.includes(query) ||
				user.email.toLowerCase().includes(query) ||
				(user.department ?? '').toLowerCase().includes(query)
			);
		});
	});

	(async () => {
		try {
			users = await getUsers();
		} catch (err) {
			console.error(err);
			error = 'Failed to load users.';
		} finally {
			isLoading = false;
		}
	})();
</script>

<div class="space-y-6">
	<div class="relative max-w-md">
		<Search size={18} class="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

		<Input bind:value={search} placeholder="Search users..." class="pl-10" />
	</div>

	{#if isLoading}
		<div class="space-y-4">
			<Skeleton class="h-12 w-full" />
			<Skeleton class="h-12 w-full" />
			<Skeleton class="h-12 w-full" />
			<Skeleton class="h-12 w-full" />
			<Skeleton class="h-12 w-full" />
		</div>
	{:else if error}
		<Card class="border-red-200">
			<CardHeader>
				<div class="flex items-center gap-2">
					<TriangleAlert class="text-red-600" />

					<CardTitle>Unable to load users</CardTitle>
				</div>

				<CardDescription>
					{error}
				</CardDescription>
			</CardHeader>
		</Card>
	{:else if filteredUsers.length === 0}
		<Card>
			<CardContent class="flex flex-col items-center justify-center py-16 text-center">
				<Users size={48} class="mb-4 text-slate-300" />

				<h3 class="text-lg font-semibold">No users found</h3>

				<p class="mt-2 text-sm text-slate-500">Try changing your search criteria.</p>
			</CardContent>
		</Card>
	{:else}
		<UsersTable users={filteredUsers} />
	{/if}
</div>
