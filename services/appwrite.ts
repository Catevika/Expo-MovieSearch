import {
	Account,
	Avatars,
	Client,
	Databases,
	Functions,
	ID,
	Query,
} from 'react-native-appwrite';

import {fetchMovieDetails} from '@/services/api';

import {
	DATABASE_ID,
	METRICS_ID,
	MOVIE_ID,
	PROJECT_ID,
	USER_ID,
} from '@/constants/variables';
import {router} from 'expo-router';

const client = new Client()
	.setEndpoint('https://cloud.appwrite.io/v1')
	.setProject(PROJECT_ID)
	.setPlatform('com.catevika.movieSearch');

export const account = new Account(client);
const avatars = new Avatars(client);
const database = new Databases(client);
const functions = new Functions(client);

export const createUser = async (
	email: string,
	password: string,
	name: string,
) => {
	try {
		// First create the auth user
		const newAuthUser = await account.create(
			ID.unique(),
			email,
			password,
			name,
		);
		if (!newAuthUser) {
			throw new Error('Failed to create auth account');
		}

		// Create a session for the new user to be able to create their profile
		await account.createEmailPasswordSession(email, password);

		// Now create their user profile
		const avatarUrl = avatars.getInitials(name).toString();
		const newDBUser = await database.createDocument(
			DATABASE_ID,
			USER_ID,
			ID.unique(),
			{
				accountId: newAuthUser.$id,
				email,
				name,
				avatar: avatarUrl,
			},
		);

		// Delete the temporary session since they need to sign in properly
		await account.deleteSession('current');

		return {success: true};
	} catch (error) {
		console.error('Error creating user:', error);
		throw new Error('Failed to create account');
	}
};

export const signin = async (email: string, password: string) => {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		const user = await account.get();
		return {success: true, user, session};
	} catch (error: any) {
		console.log(error);
		throw new Error(error);
	}
};

export const signout = async () => {
	try {
		await account.deleteSession('current');
		return {success: true};
	} catch (error) {
		console.error('Signout error:', error);
		return {success: false, error};
	}
};

// Create or update the number of times a search term is searched in the metrics collection
export const updateSearchCount = async (query: string, movie: Movie) => {
	try {
		const result = await database.listDocuments(DATABASE_ID, METRICS_ID, [
			Query.contains('searchTerm', query) || Query.contains('title', query),
		]);

		if (result.documents.length > 0) {
			const sortedMovies = result.documents.sort(
				(a, b) => b.release_date - a.release_date,
			);
			const existingMovie = sortedMovies[0];

			await database.updateDocument(
				DATABASE_ID,
				METRICS_ID,
				existingMovie.$id,
				{
					count: existingMovie.count + 1,
				},
			);
		} else {
			const newMovieCount: MovieCount = {
				searchTerm: query,
				count: 1,
				movie_id: movie.id,
				title: movie.title,
				poster_url: movie.poster_path
					? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
					: 'https://placehold.co/600x400/1a1a1a/ffffff.png',
			};

			await database.createDocument(
				DATABASE_ID,
				METRICS_ID,
				ID.unique(),
				newMovieCount,
			);
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

// Get the top 5 most searched movies from the metrics collection
export const getTrendingMovies = async (): Promise<
	TrendingMovie[] | undefined
> => {
	try {
		const response = await database.listDocuments(DATABASE_ID, METRICS_ID, [
			Query.orderDesc('count'),
			Query.limit(5),
		]);

		if (!response.documents) return undefined;

		const trendingMovies = response.documents as unknown as TrendingMovie[];

		// Fetch all movie details first
		const movieDetails = await Promise.all(
			trendingMovies.map((movie) =>
				fetchMovieDetails(movie.movie_id.toString()),
			),
		);

		// Create a map of movie_id to release_date
		const releaseDates = new Map(
			movieDetails.map((movie) => [movie.id, movie.release_date]),
		);

		// Sort by count first, then by date for equal counts
		return trendingMovies.sort((a, b) => {
			if (a.count !== b.count) {
				return b.count - a.count;
			}
			const dateA = new Date(releaseDates.get(a.movie_id) || 0);
			const dateB = new Date(releaseDates.get(b.movie_id) || 0);
			return dateB.getTime() - dateA.getTime();
		});
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

// Get the saved movies by movieId from the movies collection
export const savedMovie = async (movieId: number) => {
	const currentUser = await account.get();
	const response = await database.listDocuments(DATABASE_ID, MOVIE_ID, [
		Query.equal('movieId', movieId),
		Query.equal('userId', currentUser.$id), // Add user filter
	]);

	return response.documents.length > 0;
};

// Save a movie into the movies collection with user relationship
export const saveMovie = async (movieId: number) => {
	try {
		const currentUser = await account.get();
		const isMovieSaved = await savedMovie(movieId);

		if (isMovieSaved) return;

		// Fetch movie details to get the title
		const movieDetails = await fetchMovieDetails(movieId.toString());

		await database.createDocument(DATABASE_ID, MOVIE_ID, ID.unique(), {
			movieId,
			userId: currentUser.$id,
			title: movieDetails.title, // Add movie title
		});
	} catch (error) {
		console.log(error);
		throw new Error('Failed to save movie');
	}
};

// Get the document ID for a saved movie
const getSavedMovieDocId = async (movieId: number) => {
	const currentUser = await account.get();
	const response = await database.listDocuments(DATABASE_ID, MOVIE_ID, [
		Query.equal('movieId', movieId),
		Query.equal('userId', currentUser.$id), // Add user filter
	]);
	return response.documents[0]?.$id;
};

// Remove a movie from the movies collection
export const removeMovie = async (movieId: number) => {
	try {
		const docId = await getSavedMovieDocId(movieId);
		if (!docId) {
			throw new Error('Movie not found');
		}
		await database.deleteDocument(DATABASE_ID, MOVIE_ID, docId);
		return {success: true};
	} catch (error) {
		console.error('Error removing movie:', error);
		throw new Error('Failed to remove movie');
	}
};

// Get the saved movieIds from the movies collection for current user
const savedMoviesId = async () => {
	try {
		const currentUser = await account.get();
		const response = await database.listDocuments(DATABASE_ID, MOVIE_ID, [
			Query.equal('userId', currentUser.$id), // Filter by current user
			Query.limit(100), // Increased from default 25
		]);

		if (!response.documents) return [];
		return response.documents.map((doc) => doc.movieId);
	} catch (error) {
		console.error('Error fetching saved movies:', error);
		return [];
	}
};

// Get the TMDB movies according to the saved movieIds from the movies collection
export const fetchSavedMovies = async () => {
	const savedIds = await savedMoviesId();

	const savedMovies = await Promise.all(
		savedIds.map(async (movieId) => {
			const movieDetails = await fetchMovieDetails(movieId.toString());
			return movieDetails;
		}),
	);

	return savedMovies;
};

export const getUserProfile = async () => {
	try {
		const currentUser = await account.get();
		const response = await database.listDocuments(DATABASE_ID, USER_ID, [
			Query.equal('accountId', currentUser.$id),
		]);

		if (!response.documents.length) {
			throw new Error('User profile not found');
		}

		return response.documents[0];
	} catch (error) {
		console.error('Error getting user profile:', error);
		throw new Error('Failed to get user profile');
	}
};

export const updateUserProfile = async (
	name: string,
	email: string,
	currentPassword: string,
	newPassword?: string,
) => {
	try {
		const currentUser = await account.get();
		const avatarUrl = avatars.getInitials(name).toString();

		// First update password if provided
		if (newPassword && currentPassword) {
			await account.updatePassword(newPassword, currentPassword);
		}

		// Then update email if changed (requires password)
		if (email !== currentUser.email) {
			await account.updateEmail(email, currentPassword);
		}

		// Update name (doesn't require password)
		if (name !== currentUser.name) {
			await account.updateName(name);
		}

		// Then update user document in database using accountId
		const response = await database.listDocuments(DATABASE_ID, USER_ID, [
			Query.equal('accountId', currentUser.$id),
		]);

		if (!response.documents.length) {
			throw new Error('User profile not found');
		}

		await database.updateDocument(
			DATABASE_ID,
			USER_ID,
			response.documents[0].$id,
			{
				name,
				email,
				avatar: avatarUrl,
			},
		);

		return {success: true};
	} catch (error) {
		console.error('Error updating user:', error);
		if (
			error instanceof Error &&
			error.message.includes('Invalid credentials')
		) {
			throw new Error('Current password is incorrect');
		}
		throw error;
	}
};

export const deleteUserAccount = async () => {
	try {
		const currentUser = await account.get();

		// 1. Delete all saved movies
		const savedMovies = await database.listDocuments(DATABASE_ID, MOVIE_ID, [
			Query.equal('userId', currentUser.$id),
		]);
		await Promise.all(
			savedMovies.documents.map((doc) =>
				database.deleteDocument(DATABASE_ID, MOVIE_ID, doc.$id),
			),
		);

		// 2. Delete user profile from database
		const userProfile = await database.listDocuments(DATABASE_ID, USER_ID, [
			Query.equal('accountId', currentUser.$id),
		]);
		if (userProfile.documents.length > 0) {
			await database.deleteDocument(
				DATABASE_ID,
				USER_ID,
				userProfile.documents[0].$id,
			);
		}

		// Call the delete-account function with the exact function ID
		const response = await functions.createExecution(
			process.env.EXPO_PUBLIC_APPWRITE_DELETE_ACCOUNT_FUNCTION_ID!,
			JSON.stringify({userId: currentUser.$id}),
		);

		if (response.status === 'failed') {
			throw new Error(response.errors || 'Failed to delete account');
		}

		router.replace('/signin');
		return {success: true};
	} catch (error) {
		console.error('Delete account error:', error);
		throw error;
	}
};

export const createAuthUser = async (
	email: string,
	password: string,
	name: string,
) => {
	try {
		// First create the auth user
		const newAuthUser = await account.create(
			ID.unique(),
			email,
			password,
			name,
		);
		if (!newAuthUser) {
			throw new Error('Failed to create auth account');
		}

		// Create a session for the new user to be able to create their profile
		await account.createEmailPasswordSession(email, password);

		// Now create their user profile
		// Create a session for the new user to be able to create their profile
		await account.createEmailPasswordSession(email, password);

		// Now create their user profile
		const avatarUrl = avatars.getInitials(name).toString();
		const newDBUser = await database.createDocument(
			DATABASE_ID,
			USER_ID,
			ID.unique(),
			{
				accountId: newAuthUser.$id,
				email,
				name,
				avatar: avatarUrl,
			},
		);

		// Delete the temporary session since they need to sign in properly
		await account.deleteSession('current');

		return {success: true};
	} catch (error) {
		console.error('Error creating user:', error);
		throw new Error('Failed to create account');
	}
};

export const createUserSession = async (email: string, password: string) => {
	try {
		const session = await account.createEmailPasswordSession(email, password);
		const authUser = await account.get();
		const dbUser = await getUserProfile();

		return {success: true, session, user: {...authUser, ...dbUser}};
	} catch (error) {
		console.error('Login error:', error);
		throw new Error('Invalid credentials');
	}
};
