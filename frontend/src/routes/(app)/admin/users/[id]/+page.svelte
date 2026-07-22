<script>
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	import { ArrowLeft, TriangleAlert } from 'lucide-svelte';

	import { getUser } from '$lib/api/user';
	import { getRoles } from '$lib/api/role';

	import UserAccountCard from '$lib/components/admin/users/UserAccountCard.svelte';
	import UserProfileCard from '$lib/components/admin/users/UserProfileCard.svelte';

	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';

	import { page as pageStore } from '$lib/stores/page.svelte';

	let user = $state(null);
	let roles = $state([]);

	let isLoading = $state(true);
	let error = $state(null);

	async function loadPage() {
		isLoading = true;
		error = null;

		try {
			const [userData, roleData] = await Promise.all([
				getUser(page.params.id),
				getRoles()
			]);

			user = userData;
			roles = roleData;

			pageStore.setPage({
				title: `${user.firstName} ${user.lastName}`,
				subtitle: 'User Details'
			});
		} catch (err) {
			console.error(err);

			error = 'Failed to load user details.';

			pageStore.setPage({
				title: 'User Details',
				subtitle: ''
			});
		} finally {
			isLoading = false;
		}
	}

	function handleRoleUpdated(updatedRole) {
		user.role = updatedRole;
	}

	function handleStatusUpdated(updatedStatus) {
		user.isActive = updatedStatus.isActive;
	}

	onMount(loadPage);
</script>

<div class="space-y-6">
	<Button
		variant="ghost"
		class="w-fit"
		onclick={() => goto('/admin/users')}
	>
		<ArrowLeft class="mr-2 h-4 w-4" />
		Back to Users
	</Button>

	{#if isLoading}
		<div class="grid gap-6 lg:grid-cols-2">
			<Skeleton class="h-80 w-full rounded-xl" />
			<Skeleton class="h-80 w-full rounded-xl" />
		</div>

	{:else if error}
		<Card class="border-red-200">
			<CardHeader>
				<div class="flex items-center gap-2">
					<TriangleAlert class="text-red-600" />
					<CardTitle>Unable to load user</CardTitle>
				</div>

				<CardDescription>
					{error}
				</CardDescription>
			</CardHeader>

			<CardContent>
				<Button
					variant="outline"
					onclick={loadPage}
				>
					Retry
				</Button>
			</CardContent>
		</Card>

	{:else}
		<div class="grid gap-6 lg:grid-cols-2">
			<UserProfileCard {user} />

			<UserAccountCard
				{user}
				{roles}
				onRoleUpdated={handleRoleUpdated}
				onStatusUpdated={handleStatusUpdated}
			/>
		</div>
	{/if}
</div>