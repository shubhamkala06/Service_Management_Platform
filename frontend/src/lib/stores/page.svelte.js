class PageStore {
	title = $state('');
	subtitle = $state('');

	setPage({ title, subtitle = '' }) {
		this.title = title;
		this.subtitle = subtitle;
	}

	reset() {
		this.title = '';
		this.subtitle = '';
	}
}

export const page = new PageStore();
