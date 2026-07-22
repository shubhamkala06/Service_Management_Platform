<script>
	import Logo from '$lib/components/Logo.svelte';

	function login() {
		window.location.href = `${import.meta.env.VITE_API_URL}/auth/login`;
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-slate-100 px-6">

	<div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white px-10 py-12 shadow-xl">

		<Logo variant="stacked" />

		<div class="mt-6 text-center">

			<h2 class="text-xl font-bold text-slate-900">
				Welcome Back
			</h2>

			<p class="mt-1 text-sm leading-6 text-slate-500">
				Sign in with your organization account to continue.
			</p>

		</div>

		<button
			type="button"
			onclick={login}
			class="mt-10 w-full rounded-xl bg-emerald-500 px-5 py-3 text-base font-semibold text-slate-900 transition hover:bg-emerald-600"
		>
			Sign In
		</button>

		<p class="mt-6 text-center text-xs tracking-wide text-slate-400 uppercase">
			Secure Enterprise Authentication
		</p>

	</div>

</div>