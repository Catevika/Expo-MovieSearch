import CustomButton from '@/components/CustomButton';
import CustomFormField from '@/components/CustomFormField';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {createUser} from '@/services/auth';
import {Link, router} from 'expo-router';
import {useState} from 'react';
import {Alert, Image, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
const SignUpPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
	});

	const submit = async () => {
		const {name, email, password} = form;
		if (!email || !password || !name) {
			return Alert.alert('Error', 'Please fill in all fields');
		}

		setIsSubmitting(true);
		try {
			const {success} = await createUser(email, password, name);
			if (success) {
				Alert.alert('Success', 'Account created! Please sign in.');
				router.replace('/signin');
			}
		} catch (error: any) {
			Alert.alert('Error', error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<SafeAreaView className='relative flex-1 flex-col bg-primary'>
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
				<Text className='text-white font-bold text-6xl text-center text-normal my-5'>
					Sign Up
				</Text>
				<CustomFormField
					title='Username'
					placeholder='Jane Doe'
					value={form.name}
					onChangeText={(e: string) => setForm({...form, name: e})}
				/>
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
					text={isSubmitting ? 'Signing Up...' : 'Sign Up'}
					otherStyles='mx-5 my-5'
					disabled={isSubmitting}
				/>
				<View className='flex-row items-center justify-center'>
					<Text className='text-light-200'>Already have an account? </Text>
					<Link
						href='/signin'
						className='font-bold text-accent'>
						Sign In
					</Link>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};
export default SignUpPage;
