import {Text, View} from 'react-native';

const MovieInfo = ({label, value}: MovieInfoProps) => {
	return (
		<View className='mt-5'>
			<Text className='text-light-200 font-normal text-sm'>{label}:</Text>
			<Text className='text-white font-bold text-sm mt-2'>
				{value ? value : 'N/A'}
			</Text>
		</View>
	);
};

export default MovieInfo;
