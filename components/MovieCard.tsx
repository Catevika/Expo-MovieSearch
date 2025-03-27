import {icons} from '@/constants/icons';
import {router} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Animated, {FadeInDown} from 'react-native-reanimated';

const MovieCard = ({
	id,
	poster_path,
	title,
	release_date,
	vote_average,
	index = 0,
}: Movie & {index?: number}) => {
	return (
		<Animated.View entering={FadeInDown.delay(index * 100).springify()}>
			<View className='w-[105px]'>
				<TouchableOpacity
					onPress={() => router.push(`/movie/${id}`)}
					className='w-full h-[155px] overflow-hidden rounded-xl mb-2'>
					<Image
						source={{
							uri: poster_path
								? `https://image.tmdb.org/t/p/w500${poster_path}`
								: 'https://placehold.co/600x400/1a1a1a/ffffff.png',
						}}
						className='w-full h-full'
						resizeMode='cover'
					/>
				</TouchableOpacity>
				<Text
					className='text-white text-sm font-bold mb-1 min-h-[40px]'
					numberOfLines={2}
					ellipsizeMode='tail'>
					{title}
				</Text>
				<View className='flex-row items-center justify-between'>
					<Text className='text-light-200 text-xs'>
						{release_date?.split('-')[0]}
					</Text>
					<View className='flex-row items-center bg-dark-100 px-1.5 py-0.5 rounded-md gap-x-1'>
						<Image
							source={icons.star}
							className='w-3 h-3'
						/>
						<Text className='text-white text-xs'>
							{Math.round(vote_average)}/10
						</Text>
					</View>
				</View>
			</View>
		</Animated.View>
	);
};

export default MovieCard;
