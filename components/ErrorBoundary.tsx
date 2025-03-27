import CustomButton from '@/components/CustomButton';
import {icons} from '@/constants/icons';
import {useRouter} from 'expo-router';
import {Image, Text, View} from 'react-native';

const ErrorBoundary = ({error, retry}: ErrorBoundaryProps) => {
	const router = useRouter();

	return (
		<View className='flex-1 bg-primary justify-center items-center px-5'>
			<Image
				source={icons.logo}
				className='w-12 h-10 mb-5'
			/>
			<Text className='text-white text-lg font-bold mb-3'>
				Something went wrong
			</Text>
			<Text className='text-light-300 text-center mb-5'>{error.message}</Text>
			<View className='flex-row gap-4'>
				{retry && (
					<CustomButton
						onPress={retry}
						text='Try Again'
					/>
				)}
				<CustomButton
					onPress={() => router.replace('/(tabs)/home')}
					text='Go Home'
				/>
			</View>
		</View>
	);
};

export default ErrorBoundary;
