<script>
	let user = $state(null);
	let error = $state('');

	$effect(() => {
		(async () => {
			try {
				const response = await fetch('http://localhost:3000/api/me', {
					credentials: 'include'
				});

				if (response.status === 401) {
					window.location.href = '/login';
					return;
				}

				if (!response.ok) {
					throw new Error('Failed to fetch user');
				}

				user = await response.json();
			} catch (err) {
				console.error(err);
				error = err instanceof Error ? err.message : 'Unknown error';
			}
		})();
	});
</script>

{#if user}
	<div class="flex min-h-screen items-center justify-center">
		<h1 class="text-4xl font-bold">
			Hello, {user.firstName}
		</h1>
	</div>
{:else if error}
	<div class="flex min-h-screen items-center justify-center">
		<h1 class="text-red-600">{error}</h1>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center">
		<h1>Loading...</h1>
	</div>
{/if}