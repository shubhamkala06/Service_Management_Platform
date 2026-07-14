<script>
	function login() {
		window.location.href = 'http://localhost:3000/auth/login';
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
		<h1 class="mb-2 text-3xl font-bold text-center">
			Service Desk
		</h1>

		<p class="mb-8 text-center text-gray-600">
			Asset Management Platform
		</p>

		<button
			class="w-full rounded bg-blue-600 px-4 py-3 text-white font-semibold hover:bg-blue-700 cursor-pointer"
			onclick={login}
		>
			Sign In
		</button>
	</div>
</div>