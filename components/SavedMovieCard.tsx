import {router} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Animated, {FadeInLeft, FadeOutRight} from 'react-native-reanimated';

const SavedMovieCard = (movie: MovieDetails) => {
	return (
		<Animated.View
			entering={FadeInLeft.duration(300)}
			exiting={FadeOutRight.duration(300)}
			className='w-full mb-4'>
			<TouchableOpacity
				onPress={() => router.push(`/movie/${movie.id}`)}
				className='w-full h-[150px] overflow-hidden rounded-xl bg-dark-100 flex-row'>
				<Image
					source={{
						uri: movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: 'https://placehold.co/600x400/1a1a1a/ffffff.png',
					}}
					className='w-[100px] h-full'
					resizeMode='cover'
				/>
				<View className='flex-1 p-4'>
					<Text
						className='text-white font-bold text-lg mb-2'
						numberOfLines={1}
						ellipsizeMode='tail'>
						{movie.title}
					</Text>
					<Text
						className='text-light-200 text-sm'
						numberOfLines={4}>
						{movie.overview}
					</Text>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

export default SavedMovieCard;
