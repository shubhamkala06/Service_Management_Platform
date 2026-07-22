class AuthStore {
	isLoading = $state(true);

	isAuthenticated = $state(false);

	user = $state(null);

	setUser(user) {
		this.user = user;
		this.isAuthenticated = true;
		this.isLoading = false;
	}

	clearUser() {
		this.user = null;
		this.isAuthenticated = false;
		this.isLoading = false;
	}

	setLoading(value) {
		this.isLoading = value;
	}
}

export const auth = new AuthStore();
