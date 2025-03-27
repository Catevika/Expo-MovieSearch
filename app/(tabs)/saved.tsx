import SavedMovieCard from '@/components/SavedMovieCard';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {useAuth} from '@/context/AuthProvider';
import {fetchSavedMovies} from '@/services/appwrite';
import {MOVIE_REMOVED, MOVIE_SAVED, movieEvents} from '@/services/events';
import useFetch from '@/services/useFetch';
import {router} from 'expo-router';
import {useEffect} from 'react';
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const Saved = () => {
	const {user} = useAuth();
	const {
		data: savedMovies,
		isLoading,
		error,
		refresh,
	} = useFetch({
		fetchFunction: fetchSavedMovies,
		autoFetch: true,
	});

	useEffect(() => {
		const handleMovieUpdate = () => {
			refresh();
		};

		const savedListener = movieEvents.addListener(
			MOVIE_SAVED,
			handleMovieUpdate,
		);
		const removedListener = movieEvents.addListener(
			MOVIE_REMOVED,
			handleMovieUpdate,
		);

		return () => {
			savedListener.remove();
			removedListener.remove();
		};
	}, [refresh]);

	useEffect(() => {
		if (user) {
			refresh();
		}
	}, [user, refresh]);

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

	return (
		<View className='flex-1 flex-col bg-primary'>
			<Image
				source={images.bg}
				resizeMode='cover'
				className='absolute inset-0 w-full z-0'
			/>
			<Image
				source={icons.logo}
				className='w-12 h-10 mt-20 mb-5 mx-auto'
			/>
			<TouchableOpacity
				onPress={() => router.push('/search')}
				className='flex-row items-center bg-dark-200 gap-2 rounded-full m-5 px-5 py-4'>
				<Text className='flex-1 flex-row ml-2 m-0 p-0 text-light-200'>
					Search movies online
				</Text>
				<View className='bg-accent rounded-full p-3'>
					<Image
						source={icons.search}
						className='size-5'
						resizeMode='contain'
						tintColor='#0f0d23'
					/>
				</View>
			</TouchableOpacity>
			{savedMovies ? (
				<FlatList
					data={savedMovies}
					renderItem={({item}) => <SavedMovieCard {...item} />}
					keyExtractor={(item) => item.id.toString()}
					showsVerticalScrollIndicator={false}
					contentContainerClassName='flex-grow pb-32 px-4'
					ListHeaderComponent={
						<Text className='text-lg text-white font-bold mt-5 mb-5'>
							Saved Movies
						</Text>
					}
					refreshControl={
						<RefreshControl
							refreshing={isLoading}
							onRefresh={refresh}
							tintColor='#ab8bff'
						/>
					}
				/>
			) : (
				<Text className='text-light-300 text-center mt-5 px-4'>
					No saved movies yet
				</Text>
			)}
		</View>
	);
};

export default Saved;
