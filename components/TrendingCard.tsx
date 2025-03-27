import {images} from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import {Link} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
const TrendingCard = ({
	movie: {movie_id, title, poster_url},
	index,
}: TrendingCardProps) => {
	const id = movie_id;

	return (
		<Link
			href={`/movie/${id}`}
			asChild>
			<TouchableOpacity className='w-32 relative mr-16 pl-5'>
				<Image
					source={{uri: poster_url}}
					resizeMode='contain'
					className='w-32 h-48 rounded-lg'
				/>
				<View className='absolute top-32 -left-3.5 px-2 py-1 rounded-full'>
					<MaskedView
						maskElement={
							<Text className='text-white font-bold text-6xl'>{index + 1}</Text>
						}>
						<Image
							source={images.rankingGradient}
							resizeMode='cover'
							className='size-14'
						/>
					</MaskedView>
				</View>
				<Text
					numberOfLines={2}
					className='text-sm font-bold text-light-200 mt-2'>
					{title}
				</Text>
			</TouchableOpacity>
		</Link>
	);
};

export default TrendingCard;
