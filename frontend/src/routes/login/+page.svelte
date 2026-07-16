<script>
	import { goto } from '$app/navigation';

	let loading = $state(false);
	let error = $state('');

	function handleLogin() {
		window.location.href =
			`${import.meta.env.VITE_API_URL}/auth/login`;
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-[#F7FAF9] px-6">
	<div class="w-full max-w-md rounded-2xl border border-[#DCE5E7] bg-white p-10 shadow-xl">

		<div class="flex flex-col items-center">

			<!-- Logo -->
			<div class="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border-2 border-[#003B49] bg-white">
				<span class="text-lg font-bold tracking-wide">
					<span class="text-[#003B49]">S</span><span class="text-[#2ED47A]">A</span><span class="text-[#003B49]">M</span>
				</span>
			</div>

			<!-- Title -->
			<h1 class="text-3xl font-bold tracking-tight text-[#003B49]">
				Service Desk
			</h1>

			<p class="mt-1 text-base text-[#64727A]">
				Asset Management Platform
			</p>

			<div class="my-6 h-1 w-16 rounded-full bg-[#2ED47A]"></div>

			<!-- Welcome -->
			<h2 class="text-xl font-semibold text-[#003B49]">
				Welcome Back
			</h2>

			<p class="mt-2 text-center text-sm leading-6 text-[#64727A]">
				Sign in with your organization account to continue.
			</p>

			{#if error}
				<div
					class="mt-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
				>
					{error}
				</div>
			{/if}

			<!-- Login Button -->
			<button
				onclick={handleLogin}
				disabled={loading}
				class="mt-8 w-full rounded-xl bg-[#2ED47A] px-5 py-3 text-base font-semibold text-[#003B49] transition duration-200 hover:bg-[#28C56F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
			>
				{#if loading}
					Signing in...
				{:else}
					Sign in with Company SSO
				{/if}
			</button>

			<!-- Footer -->
			<div class="mt-8 flex w-full items-center">
				<div class="h-px flex-1 bg-[#DCE5E7]"></div>

				<span class="px-3 text-xs uppercase tracking-wider text-[#98A3A9]">
					Secure Enterprise Authentication
				</span>

				<div class="h-px flex-1 bg-[#DCE5E7]"></div>
			</div>

		</div>
	</div>
</div>