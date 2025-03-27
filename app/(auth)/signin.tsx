import CustomButton from '@/components/CustomButton';
import CustomFormField from '@/components/CustomFormField';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {useAuth} from '@/context/AuthProvider';
import {Link} from 'expo-router';
import {useState} from 'react';
import {Alert, Image, ScrollView, Text, View} from 'react-native';

const SignInPage = () => {
	const {signIn} = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	const submit = async () => {
		const {email, password} = form;

		if (!email || !password) {
			return Alert.alert('Error', 'Please fill in all fields');
		}

		setIsLoading(true);
		try {
			await signIn(email, password);
		} catch (error: any) {
			Alert.alert('Error', error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View className='relative flex-1 flex-col bg-primary'>
			<ScrollView>
				<Image
					source={images.bg}
					resizeMode='cover'
					className='absolute inset-0 w-full z-0'
				/>
				<Image
					source={icons.logo}
					className='w-12 h-10 mt-20 mb-5 mx-auto'
				/>
				<Text className='text-white font-bold text-6xl text-center text-normal my-10'>
					Sign In
				</Text>
				<CustomFormField
					title='Email'
					placeholder='jane.doe@example.com'
					value={form.email}
					onChangeText={(e: string) => setForm({...form, email: e})}
				/>
				<CustomFormField
					title='Password'
					placeholder='...'
					value={form.password}
					onChangeText={(e: string) => setForm({...form, password: e})}
				/>
				<CustomButton
					onPress={submit}
					text={isLoading ? 'Signing In...' : 'Sign In'}
					otherStyles='mx-5 my-5'
					disabled={isLoading}
				/>
				<View className='flex-row items-center justify-center'>
					<Text className='text-light-200'>Don't have an account? </Text>
					<Link
						href='/signup'
						className='font-bold text-accent'>
						Sign Up
					</Link>
				</View>
			</ScrollView>
		</View>
	);
};
export default SignInPage;
