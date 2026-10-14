import {images} from '@/constants/images';
import MaskedView from '@react-native-masked-view/masked-view';
import {Link} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
const TrendingCard = ({
	movie: {movie_id, title, poster_url},
	index,
	cardWidth = 128,
}: TrendingCardProps) => {
	const id = movie_id;

	return (
		<Link
			href={`/movie/${id}`}
			asChild>
			<TouchableOpacity
				style={{width: cardWidth}}
				className='relative'>
				<Image
					source={{uri: poster_url}}
					resizeMode='cover'
					className='w-full rounded-lg'
					style={{aspectRatio: 2 / 3}}
				/>
				<View
					className='absolute'
					style={{
						top: cardWidth,
						left: -cardWidth * 0.11,
					}}>
					<MaskedView
						maskElement={
							<Text
								className='text-white font-bold'
								style={{
									fontSize: cardWidth * 0.46,
									lineHeight: cardWidth * 0.5,
								}}>
								{index + 1}
							</Text>
						}>
						<Image
							source={images.rankingGradient}
							resizeMode='cover'
							style={{
								width: cardWidth * 0.45,
								height: cardWidth * 0.45,
							}}
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
