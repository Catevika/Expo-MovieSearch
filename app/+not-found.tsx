import {icons} from '@/constants/icons';
import {Link} from 'expo-router';
import {Image, Text, View} from 'react-native';

const NotFoundScreen = () => {
	return (
		<View className='flex-1 bg-primary justify-center items-center px-5'>
			<Image
				source={icons.logo}
				className='w-12 h-10 mb-5'
			/>
			<Text className='text-white text-lg font-bold mb-3'>
				Oops! Something went wrong
			</Text>
			<Text className='text-light-300 text-center mb-5'>
				We couldn't find what you were looking for.
			</Text>
			<Link
				href='/(tabs)/home'
				className='bg-accent px-5 py-3 rounded-lg'>
				<Text className='text-dark-200 font-semibold'>Go Home</Text>
			</Link>
		</View>
	);
};

export default NotFoundScreen;
