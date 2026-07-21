<script>
	import { goto } from '$app/navigation';
	import { getCurrentUser } from '$lib/api/auth';

	let loading = $state(true);
	let user = $state(null);
	let error = $state('');

	async function loadUser() {
		try {
			user = await getCurrentUser();
		} catch (err) {
			if (err.response?.status === 401) {
				await goto('/login');
				return;
			}

			console.error(err);
			error = 'Unable to load profile.';
		} finally {
			loading = false;
		}
	}

	loadUser();

	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-IN', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center bg-[#F7FAF9]">
		<p class="text-lg text-[#003B49]">Loading profile...</p>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center bg-[#F7FAF9]">
		<p class="text-red-600">{error}</p>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-[#F7FAF9] px-6 py-10">
		<div class="w-full max-w-2xl rounded-2xl border border-[#DCE5E7] bg-white p-10 shadow-sm">
			<!-- Profile Header -->

			<div class="flex flex-col items-center">
				<div
					class="flex h-24 w-24 items-center justify-center rounded-full bg-[#2ED47A] text-4xl font-bold text-[#003B49]"
				>
					{user.firstName[0]}{user.lastName[0]}
				</div>

				<h1 class="mt-5 text-3xl font-bold text-[#003B49]">
					{user.firstName}
					{user.lastName}
				</h1>

				<p class="mt-1 capitalize text-[#64727A]">
					{user.department}
				</p>

				<p class="mt-2 text-sm text-[#64727A]">
					{user.email}
				</p>
			</div>

			<!-- Divider -->

			<div class="my-8 border-t border-[#DCE5E7]"></div>

			<h2 class="mb-6 text-xl font-semibold text-[#003B49]">Account Information</h2>

			<div class="space-y-5">
				<div class="flex justify-between border-b border-[#EEF2F3] pb-3">
					<span class="text-[#64727A]">First Name</span>
					<span class="font-medium text-[#003B49]">{user.firstName}</span>
				</div>

				<div class="flex justify-between border-b border-[#EEF2F3] pb-3">
					<span class="text-[#64727A]">Last Name</span>
					<span class="font-medium text-[#003B49]">{user.lastName}</span>
				</div>

				<div class="flex justify-between border-b border-[#EEF2F3] pb-3">
					<span class="text-[#64727A]">Email</span>
					<span class="font-medium text-[#003B49]">{user.email}</span>
				</div>

				<div class="flex justify-between border-b border-[#EEF2F3] pb-3">
					<span class="text-[#64727A]">Department</span>
					<span class="font-medium capitalize text-[#003B49]">
						{user.department}
					</span>
				</div>

				<div class="flex justify-between border-b border-[#EEF2F3] pb-3">
					<span class="text-[#64727A]">Date of Joining</span>
					<span class="font-medium text-[#003B49]">
						{formatDate(user.dateOfJoining)}
					</span>
				</div>

				<div class="flex justify-between">
					<span class="text-[#64727A]">Last Login</span>
					<span class="font-medium text-[#003B49]">
						{formatDate(user.lastLoginAt)}
					</span>
				</div>
			</div>
		</div>
	</div>
{/if}
