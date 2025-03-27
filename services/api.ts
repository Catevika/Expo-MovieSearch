import {TMDB_API_KEY, TMDB_BASE_URL} from '@/constants/variables';

export const TMDB_CONFIG = {
	BASE_URL: TMDB_BASE_URL,
	API_KEY: TMDB_API_KEY,
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${TMDB_API_KEY}`,
	},
};

const sortMoviesByDate = (movies: Movie[]) => {
	return movies.sort((a, b) => {
		const dateA = new Date(a.release_date);
		const dateB = new Date(b.release_date);
		return dateB.getTime() - dateA.getTime();
	});
};

export const fetchMovies = async ({
	query = '',
}: {
	query?: string;
}): Promise<Movie[]> => {
	try {
		const endpoint = query
			? `/search/movie?include_adult=false&query=${encodeURIComponent(
					query,
			  )}&sort_by=release_date.desc`
			: '/discover/movie?include_adult=false&sort_by=release_date.desc';

		const response = await fetch(`${TMDB_CONFIG.BASE_URL}${endpoint}`, {
			method: 'GET',
			headers: TMDB_CONFIG.headers,
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		const data = await response.json();
		if (!data.results) return [];
		return sortMoviesByDate(data.results);
	} catch (error) {
		console.error('Error fetching movies:', error);
		throw new Error('Failed to fetch movies. Please try again later.');
	}
};

export const fetchMovieDetails = async (
	movieId: string,
): Promise<MovieDetails> => {
	try {
		const response = await fetch(
			`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
			{
				method: 'GET',
				headers: TMDB_CONFIG.headers,
			},
		);

		if (!response.ok) {
			throw new Error('Failed to fetch movie details');
		}
		return response.json();
	} catch (error) {
		console.log(error);
		throw new Error('Failed to fetch movie details');
	}
};
