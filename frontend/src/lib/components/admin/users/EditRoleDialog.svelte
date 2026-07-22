<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';

	import { updateUserRole } from '$lib/api/user';

	let {
		userId,
		currentRole,
		roles,
		onUpdated = () => {}
	} = $props();

	let open = $state(false);
	let saving = $state(false);
	let selectedRoleName = $state('');

	$effect(() => {
		if (open) {
			selectedRoleName = currentRole.name;
		}
	});

	async function handleSubmit(event) {
		event.preventDefault();

		if (saving) {
			return;
		}

		if (selectedRoleName === currentRole.name) {
			open = false;
			return;
		}

		saving = true;

		try {
			const updatedRole = await updateUserRole(
				userId,
				selectedRoleName
			);

			onUpdated(updatedRole);
			open = false;
		} finally {
			saving = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button
			variant="outline"
			size="sm"
		>
			Edit Role
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={handleSubmit}>
			<Dialog.Header>
				<Dialog.Title>Edit User Role</Dialog.Title>

				<Dialog.Description>
					Assign a new role to this user.
				</Dialog.Description>
			</Dialog.Header>

			<div class="py-4">
				<Select.Root
					type="single"
					bind:value={selectedRoleName}
				>
					<Select.Trigger class="w-full">
						{selectedRoleName}
					</Select.Trigger>

					<Select.Content>
						<Select.Group>
							<Select.Label>
								Available Roles
							</Select.Label>

							{#each roles as role}
								<Select.Item
									value={role.name}
									label={role.name}
								>
									{role.name}
								</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>

			<Dialog.Footer>
				<Dialog.Close>
					<Button
						type="button"
						variant="outline"
						disabled={saving}
					>
						Cancel
					</Button>
				</Dialog.Close>

				<Button
					type="submit"
					disabled={saving}
				>
					{#if saving}
						Saving...
					{:else}
						Save
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>