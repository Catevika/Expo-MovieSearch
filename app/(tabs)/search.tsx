import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {fetchMovies} from '@/services/api';
import {updateSearchCount} from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, Text, View} from 'react-native';

const Search = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const {
		data: searchedMovies,
		isLoading: searchIsLoading,
		error,
		refetch: loadMovies,
		reset,
	} = useFetch({
		fetchFunction: () => fetchMovies({query: searchQuery}),
		autoFetch: false,
	});

	const handleSubmit = () => {
		if (searchQuery.trim()) {
			loadMovies();
		} else {
			reset();
		}
	};

	const handleSearchChange = (text: string) => {
		setSearchQuery(text);
		if (!text.trim()) {
			reset();
		}
	};

	const handleReset = () => {
		setSearchQuery('');
		reset();
	};

	useEffect(() => {
		if (!searchedMovies || searchedMovies.length === 0) {
			return;
		}
		updateSearchCount(searchQuery, searchedMovies[0]);
	}, [searchedMovies, searchQuery]);

	return (
		<View className='relative flex-1 flex-col bg-primary'>
			<Image
				source={images.bg}
				resizeMode='cover'
				className='absolute inset-0 w-full z-0'
			/>
			<Image
				source={icons.logo}
				className='w-12 h-10 mt-20 mb-10 mx-auto'
			/>
			<SearchBar
				value={searchQuery}
				setValue={setSearchQuery}
				onChangeText={handleSearchChange}
				onSubmitEditing={handleSubmit}
				onReset={handleReset}
			/>
			<FlatList
				data={searchedMovies || []}
				renderItem={({item}) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				showsVerticalScrollIndicator={false}
				className='px-5'
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: 'center',
					gap: 16,
					marginVertical: 16,
				}}
				contentContainerStyle={{
					paddingBottom: 100,
				}}
				ListHeaderComponent={
					<>
						{searchIsLoading && (
							<ActivityIndicator
								size='large'
								color='#ab8bff'
							/>
						)}
						{error && (
							<Text className='text-red-500 px-5 my-3'>
								Error: {error.message}
							</Text>
						)}
						{!searchIsLoading && !error && searchQuery.trim() && (
							<View className='bg-dark-100 px-2 py-1 rounded-md mt-5 mb-3'>
								<Text className='text-xl text-white font-bold'>
									Search results for{' '}
									<Text className='text-accent'>{searchQuery.trim()}</Text>
								</Text>
							</View>
						)}
					</>
				}
				ListEmptyComponent={
					!searchIsLoading && !error ? (
						<View className='mt-10'>
							{searchQuery.trim() ? (
								<Text className='text-lg text-accent font-bold'>
									No movie found.
								</Text>
							) : (
								<Text className='text-lg text-white font-bold'>
									Find your favorite movie now!
								</Text>
							)}
						</View>
					) : null
				}
			/>
		</View>
	);
};

export default Search;
