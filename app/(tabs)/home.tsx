import MovieCard from '@/components/MovieCard';
import TrendingCard from '@/components/TrendingCard';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {fetchMovies} from '@/services/api';
import {getTrendingMovies} from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import {router} from 'expo-router';
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Image,
	RefreshControl,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

export default function Home() {
	const {
		data: movies,
		isLoading: moviesIsLoading,
		error: moviesError,
		refetch: refetchMovies,
	} = useFetch({
		fetchFunction: () => fetchMovies({query: ''}),
		autoFetch: true,
	});

	const {
		data: trendingMovies,
		isLoading: trendingIsLoading,
		error: trendingError,
		refetch: refetchTrending,
	} = useFetch({fetchFunction: getTrendingMovies, autoFetch: true});

	const onRefresh = () => {
		try {
			Promise.all([refetchMovies(), refetchTrending()]);
		} catch (error) {
			Alert.alert('Error', 'Failed to refresh movies');
		}
	};

	if (!movies) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<Text className='text-lg text-white font-bold mt-5 mb-3'>
					Latest Movies to come!
				</Text>
			</View>
		);
	}

	if (moviesIsLoading || trendingIsLoading) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<ActivityIndicator
					size='large'
					color='#ab8bff'
				/>
			</View>
		);
	}

	if (moviesError || trendingError) {
		return (
			<View className='flex-1 bg-primary justify-center items-center p-5'>
				<Text className='text-red-500 px-5 my-3'>
					Error: {moviesError?.message || trendingError?.message}
				</Text>
			</View>
		);
	}

	return (
		<>
			<StatusBar
				barStyle='light-content'
				backgroundColor='transparent'
				translucent={true}
			/>
			<View className='relative flex-1 flex-col bg-primary'>
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
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{minHeight: '100%', paddingBottom: 10}}
					className='flex-1 px-5'
					refreshControl={
						<RefreshControl
							refreshing={moviesIsLoading || trendingIsLoading}
							onRefresh={onRefresh}
							tintColor='#ab8bff'
						/>
					}>
					<View className='flex-1 mt-5'>
						<Text className='text-lg text-white font-bold mb-3'>
							Trending Movies
						</Text>
						{trendingMovies ? (
							<FlatList
								data={trendingMovies}
								renderItem={({item, index}) => (
									<TrendingCard
										movie={item}
										index={index}
									/>
								)}
								keyExtractor={(item) => item.movie_id.toString()}
								horizontal
								showsHorizontalScrollIndicator={false}
								ItemSeparatorComponent={() => <View className='w-4' />}
								className='mt-3 mb-4'
							/>
						) : (
							<Text className='text-lg text-light-300 font-bold'>
								Trending Movies to come!
							</Text>
						)}
						<Text className='text-lg text-white font-bold mt-5 mb-3'>
							Latest Movies
						</Text>
						{movies ? (
							<FlatList
								data={movies}
								renderItem={({item}) => <MovieCard {...item} />}
								keyExtractor={(item) => item.id.toString()}
								numColumns={3}
								columnWrapperStyle={{
									justifyContent: 'flex-start',
									gap: 20,
									paddingRight: 5,
									marginBottom: 10,
								}}
								className='mt-2 pb-32'
								scrollEnabled={false}
							/>
						) : (
							<Text className='text-lg text-white font-bold mt-5 mb-3'>
								Latest Movies to come!
							</Text>
						)}
					</View>
				</ScrollView>
			</View>
		</>
	);
}
