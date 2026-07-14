<script>
	function login() {
		window.location.href = 'http://localhost:3000/auth/login';
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-slate-100">
	<div class="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">

		<div class="mb-10 text-center">
			<div class="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
				SD
			</div>

			<h1 class="text-3xl font-bold text-slate-800">
				Service Desk
			</h1>

			<p class="mt-2 text-slate-500">
				Asset Management Platform
			</p>
		</div>

		<div class="mb-8 text-center">
			<p class="text-slate-600">
				Sign in using your organization account.
			</p>
		</div>

		<button
			onclick={login}
			class="w-full rounded-lg bg-blue-600 px-5 py-3 text-lg font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-95"
		>
			Sign in with Company SSO
		</button>

		<div class="mt-8 border-t pt-6 text-center">
			<p class="text-sm text-slate-400">
				Secured by Authentik
			</p>
		</div>

	</div>
</div>