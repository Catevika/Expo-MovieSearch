import CustomButton from '@/components/CustomButton';
import {icons} from '@/constants/icons';
import {useAuth} from '@/context/AuthProvider';
import {getUserProfile} from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import {format} from 'date-fns';
import {router} from 'expo-router';
import {useState} from 'react';
import {ActivityIndicator, Alert, Image, Text, View} from 'react-native';

const Profile = () => {
	const {signOut} = useAuth();
	const [isSigningOut, setIsSigningOut] = useState(false);

	const {data: userProfile, isLoading} = useFetch({
		fetchFunction: getUserProfile,
		autoFetch: true,
	});

	const formatDate = (date: string) => {
		try {
			return format(new Date(date), 'MMMM dd, yyyy');
		} catch (error) {
			return 'Date unavailable';
		}
	};

	const handleSignout = async () => {
		setIsSigningOut(true);
		try {
			await signOut();
			Alert.alert('Success', 'You have been signed out.');
		} catch (error) {
			console.error('Error signing out:', error);
			Alert.alert('Error', 'Failed to sign out');
		} finally {
			setIsSigningOut(false);
		}
	};

	if (isLoading) {
		return (
			<View className='flex-1 bg-primary justify-center items-center'>
				<ActivityIndicator
					size='large'
					color='#ab8bff'
				/>
			</View>
		);
	}

	return (
		<View className='relative flex-1 flex-col bg-primary p-5'>
			<View className='relative flex-1 w-full self-center md:w-4/5'>
				<Image
					source={icons.person}
					className='mt-20 size-6 mx-auto mb-5'
				/>
				<View className='flex-row items-center m-6'>
					<Image
						source={{uri: userProfile?.avatar}}
						className='size-10 font-bold rounded-full m-2 p-3'
						resizeMode='contain'
						tintColor='accent'
					/>
					<View className='flex-1 flex-col justify-center m-2'>
						<View className='flex-row flex-wrap items-center'>
							<Text className='text-light-200 text-base md:text-lg font-bold'>
								Hello,{' '}
							</Text>
							<Text className='text-accent text-base md:text-lg font-bold'>
								{userProfile?.name}
							</Text>
						</View>
					</View>
				</View>
				<Text className='text-white text-lg md:text-xl font-bold my-5'>
					Account details
				</Text>
				<View className='flex-1 flex-col justify-center gap-1 bg-dark-200 rounded-xl mb-44'>
					<View className='flex-1 flex-col justify-center mt-5 ml-12'>
						<Text className='text-white text-base md:text-lg px-5'>
							Account creation
						</Text>
						<Text className='text-light-200 text-base md:text-lg mb-5 px-5'>
							{formatDate(userProfile?.$createdAt || '')}
						</Text>
						<Text className='text-white text-base md:text-lg px-5'>Email</Text>
						<Text className='text-light-200 text-base md:text-lg px-5'>
							{userProfile?.email}
						</Text>
					</View>
					<CustomButton
						onPress={() => router.push('/update-account')}
						text='Update Account'
						otherStyles='w-fit min-w-[160px] self-center mt-5 mb-5'
					/>
				</View>
				<View className='absolute bottom-24 left-0 right-0 items-center'>
					<CustomButton
						onPress={handleSignout}
						text={isSigningOut ? 'Signing out...' : 'Sign Out'}
						otherStyles='w-fit min-w-[160px]'
						disabled={isSigningOut}
					/>
				</View>
			</View>
		</View>
	);
};

export default Profile;
