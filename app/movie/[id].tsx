import CustomButton from '@/components/CustomButton';
import MovieInfo from '@/components/MovieInfo';
import {icons} from '@/constants/icons';
import {fetchMovieDetails} from '@/services/api';
import {removeMovie, savedMovie, saveMovie} from '@/services/appwrite';
import {MOVIE_REMOVED, MOVIE_SAVED, movieEvents} from '@/services/events';
import {convertMinutesToHoursAndMinutes} from '@/services/runtime';
import useFetch from '@/services/useFetch';
import {router, useLocalSearchParams} from 'expo-router';
import {useEffect, useState} from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const MovieDetails = () => {
	const {id} = useLocalSearchParams();

	const [isSaved, setIsSaved] = useState(false);
	const [isToggling, setIsToggling] = useState(false);

	useEffect(() => {
		const checkSavedStatus = async () => {
			const saved = await savedMovie(Number(id));
			saved && setIsSaved(true);
		};
		checkSavedStatus();
	}, [id]);

	const {
		data: movie,
		isLoading,
		error,
	} = useFetch({
		fetchFunction: () => fetchMovieDetails(id.toString()),
		autoFetch: true,
	});

	if (isLoading) {
		return (
			<View className='bg-primary flex-1 justify-center items-center'>
				<ActivityIndicator
					size='large'
					color='#ab8bff'
				/>
			</View>
		);
	}

	if (error) {
		return (
			<View className='bg-primary flex-1 justify-center items-center'>
				<Text className='text-red-500 px-5 my-3'>Error: {error?.message}</Text>
			</View>
		);
	}

	if (!movie) {
		return (
			<View className='bg-primary flex-1 justify-center items-center'>
				<Text className='text-white text-center'>No movie found</Text>
			</View>
		);
	}

	const runtime = convertMinutesToHoursAndMinutes(movie.runtime);

	const toggleSave = async () => {
		setIsToggling(true);
		try {
			if (isSaved) {
				await removeMovie(movie.id);
				setIsSaved(false);
				movieEvents.emit(MOVIE_REMOVED);
				Alert.alert('Success', 'Movie removed from saved list');
			} else {
				await saveMovie(movie.id);
				setIsSaved(true);
				movieEvents.emit(MOVIE_SAVED);
				Alert.alert('Success', 'Movie saved successfully!');
			}
		} catch (error) {
			Alert.alert(
				'Error',
				isSaved ? 'Failed to remove movie' : 'Failed to save movie',
			);
		} finally {
			setIsToggling(false);
		}
	};

	return (
		<View className='bg-primary flex-1'>
			<ScrollView contentContainerStyle={{paddingBottom: 80}}>
				<>
					<View>
						<Image
							source={{
								uri: movie.poster_path
									? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
									: 'https://placehold.co/600x400/1a1a1a/ffffff.png',
							}}
							className='w-full h-[550px]'
							resizeMode='contain'
						/>
					</View>
					<View className='flex-col justify-center mt-5 px-5'>
						<View className='flex-row justify-between items-center gap-2'>
							<Text className='flex-1 text-white font-bold text-xl'>
								{movie?.title ? movie.title : 'N/A'}
							</Text>
							<TouchableOpacity
								onPress={toggleSave}
								disabled={isToggling}
								className={isToggling ? 'opacity-50' : ''}>
								<Image
									source={isSaved ? icons.saved : icons.save}
									className='size-5'
									tintColor={isToggling ? '#cccccc' : '#ab8bff'}
								/>
							</TouchableOpacity>
						</View>
						<View className='flex-row justify-between mt-2'>
							<Text className='text-light-200 font-normal text-sm'>
								date:{' '}
								<Text className='text-white font-bold text-sm'>
									{movie?.release_date
										? movie.release_date?.split('-')[0]
										: 'N/A'}
								</Text>
							</Text>
							{runtime ? (
								<View className='flex-row gap-x-1'>
									<Text className='text-light-200 font-normal text-sm'>
										runtime:{' '}
										<Text className='text-white font-bold text-sm'>
											{runtime.hours ? `${runtime.hours}h` : ''}
											{runtime.remainingMinutes}m
										</Text>
									</Text>
								</View>
							) : (
								<View className='flex-row gap-x-1'>
									<Text className='text-light-200 font-normal text-sm'>
										runtime:{' '}
										<Text className='text-white font-bold text-sm'>N/A</Text>
									</Text>
								</View>
							)}
						</View>
						<View className='flex-1 flex-row justify-between items-center text-white font-bold'>
							<View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
								<Image
									source={icons.star}
									className='size-4'
									resizeMode='contain'
								/>
								<Text className='text-white text-sm'>
									{movie?.vote_average.toFixed(1)}
								</Text>
							</View>
							<View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md mt-2'>
								<Text className='text-light-200 font-normal text-sm'>
									votes:{' '}
								</Text>
								<Text className='text-white font-bold text-sm'>
									{movie?.vote_count ? movie.vote_count.toLocaleString() : 0}
								</Text>
							</View>
						</View>
						<MovieInfo
							label='Overview'
							value={movie?.overview ? movie.overview : 'N/A'}
						/>
						<View className='flex-col items-start justify-center mt-5'>
							<Text className='text-light-200 font-normal text-sm'>
								Genres:
							</Text>
							<View className='flex-row flex-wrap gap-x-2 mt-2'>
								{movie?.genres
									? movie.genres.map((genre, index) => (
											<View
												key={index}
												className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
												<Text className='text-white font-bold text-sm'>
													{genre.name}{' '}
												</Text>
											</View>
									  ))
									: 'N/A'}
							</View>
						</View>
						<View className='flex-1 flex-row justify-between items-center'>
							<MovieInfo
								label='Budget'
								value={
									movie?.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'
								}
							/>
							<MovieInfo
								label='Revenue'
								value={
									movie?.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'
								}
							/>
						</View>
						<MovieInfo
							label='Production Companies'
							value={
								movie?.production_companies
									? movie.production_companies
											.map((company) => company.name)
											.join(' - ')
									: 'N/A'
							}
						/>
					</View>
				</>
			</ScrollView>
			<CustomButton
				onPress={router.back}
				text='Go Back'
				otherStyles='mx-5 absolute bottom-5 left-0 right-0'
			/>
		</View>
	);
};
export default MovieDetails;
