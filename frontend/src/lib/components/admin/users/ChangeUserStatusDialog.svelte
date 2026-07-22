<script>
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';

	import { updateUserStatus } from '$lib/api/user';

	let {
		userId,
		isActive,
		onUpdated = () => {}
	} = $props();

	let open = $state(false);
	let saving = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();

		if (saving) {
			return;
		}

		saving = true;

		try {
			const status = await updateUserStatus(
				userId,
				!isActive
			);

			onUpdated(status);
			open = false;
		} finally {
			saving = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button
			variant={isActive ? 'destructive' : 'default'}
			size="sm"
		>
			{isActive ? 'Deactivate User' : 'Activate User'}
		</Button>
	</Dialog.Trigger>

	<Dialog.Content class="sm:max-w-md">
		<form onsubmit={handleSubmit}>
			<Dialog.Header>
				<Dialog.Title>
					{isActive
						? 'Deactivate User'
						: 'Activate User'}
				</Dialog.Title>

				<Dialog.Description>
					{#if isActive}
						Are you sure you want to deactivate this
						user? The user will no longer be able to sign
						in until their account is reactivated.
					{:else}
						Are you sure you want to activate this user?
						The user will be able to sign in again.
					{/if}
				</Dialog.Description>
			</Dialog.Header>

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
					variant={isActive ? 'destructive' : 'default'}
					disabled={saving}
				>
					{#if saving}
						Saving...
					{:else}
						{isActive
							? 'Deactivate'
							: 'Activate'}
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>