interface Movie {
	id: number;
	title: string;
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	release_date: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

interface TrendingMovie {
	searchTerm: string;
	movie_id: number;
	title: string;
	count: number;
	poster_url: string;
}

interface MovieCount {
	searchTerm: string;
	count: number;
	movie_id: number;
	title: string;
	poster_url: string;
}

interface MovieDetails {
	adult: boolean;
	backdrop_path: string | null;
	belongs_to_collection: {
		id: number;
		name: string;
		poster_path: string;
		backdrop_path: string;
	} | null;
	budget: number;
	genres: {
		id: number;
		name: string;
	}[];
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	production_companies: {
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	release_date: string;
	revenue: number;
	runtime: number | null;
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

interface TrendingCardProps {
	movie: TrendingMovie;
	index: number;
}

interface MovieInfoProps {
	label: string;
	value?: string | number | null;
}

interface UseFetchOptions<T> {
	fetchFunction: () => Promise<T>;
	autoFetch?: boolean;
}

interface UseFetchResult<T> {
	data: T | null;
	isLoading: boolean;
	error: Error | null;
	refetch: () => Promise<void>;
	refresh: () => void;
	reset: () => void;
}

interface SearchBarProps {
	value: string;
	setValue: (value: string) => void;
	onChangeText: (text: string) => void;
	onSubmitEditing: () => void;
	onReset: () => void;
}

interface buttonProps {
	onPress: () => void;
	text: string;
	disabled?: boolean;
	otherStyles?: string;
}

interface FieldProps {
	title: string;
	value?: string;
	placeholder: string;
	placeholderTextColor?: string;
	onChangeText: (e: string) => void;
	otherStyles?: string;
}

interface User {
	name: string;
	email: string;
	password: string;
	accountId: string;
	avatar: URL;
}

interface SavedMovie {
	movieId: number;
	userId: string;
	title: string;
	$id: string;
}

interface NativeEventEmitter {
	addListener(
		eventType: string,
		listener: (...args: any[]) => void,
	): EmitterSubscription;
	removeAllListeners(eventType: string): void;
	emit(eventType: string, ...params: any[]): void;
}

interface EmitterSubscription {
	remove(): void;
}

interface ErrorBoundaryProps {
	error: Error;
	retry?: () => void;
}

interface runtime {
	hours: number | null;
	remainingMinutes: string;
}
