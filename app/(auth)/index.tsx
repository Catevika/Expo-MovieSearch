import CustomButton from '@/components/CustomButton';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {router} from 'expo-router';
import {Image, StatusBar, Text, View} from 'react-native';
const index = () => {
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
					className='w-12 h-10 mt-20 mx-auto'
				/>
				<View className='flex-1 flex-col justify-center items-center px-5'>
					<Text className='text-white font-bold text-2xl my-5'>Welcome to</Text>
					<Text className='text-white font-bold text-4xl'>MovieSearch</Text>
					<Text className='text-light-200 text-center mb-10'>
						The Movie Database at your fingertips
					</Text>
					<View className='px-5 mt-10 mb-20'>
						<Image
							source={images.tmdbLogo}
							resizeMode='contain'
							className='mx-auto'
						/>
						<Text className='text-light-200 text-xs text-center italic mt-2'>
							This product uses the TMDB API
						</Text>
						<Text className='text-light-200 text-xs text-center italic'>
							but is not endorsed or certified by TMDB.
						</Text>
					</View>
				</View>
				<CustomButton
					onPress={() => router.push('/home')}
					text='Continue'
					otherStyles='mx-5 mb-10'
				/>
			</View>
		</>
	);
};
export default index;
