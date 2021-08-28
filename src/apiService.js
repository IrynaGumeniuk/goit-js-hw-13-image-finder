export default class ApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    fetchImages() {
        const API_KEY = '23089090-b881069149d08b76d7d8b0f8f';
        const BASE_URL = 'https://pixabay.com/api/';
        return fetch(
            `${BASE_URL}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`,
        )
            .then(r => r.json())
            .then(({ hits }) => {
                this.incrementPage();
                return hits;
            });
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    get query() {
        return this.searchQuery;
    }
    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
