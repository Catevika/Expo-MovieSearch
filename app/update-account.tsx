import CustomButton from '@/components/CustomButton';
import CustomFormField from '@/components/CustomFormField';
import {icons} from '@/constants/icons';
import {images} from '@/constants/images';
import {useAuth} from '@/context/AuthProvider';
import {updateUser} from '@/services/auth';
import {router} from 'expo-router';
import {useEffect, useState} from 'react';
import {Alert, Image, ScrollView, Text, View} from 'react-native';

const UpdateAccount = () => {
	const {user} = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		currentPassword: '',
	});

	useEffect(() => {
		if (user) {
			setForm({
				name: user.name || '',
				email: user.email || '',
				password: '',
				currentPassword: '',
			});
		}
	}, [user]);

	const submit = async () => {
		if (!form.name || !form.email) {
			return Alert.alert('Error', 'Name and email are required');
		}

		if (form.password && !form.currentPassword) {
			return Alert.alert(
				'Error',
				'Current password is required to set new password',
			);
		}

		if (form.email !== user?.email && !form.currentPassword) {
			return Alert.alert(
				'Error',
				'Current password is required to change email',
			);
		}

		setIsSubmitting(true);
		try {
			const {success} = await updateUser(
				form.name,
				form.email,
				form.currentPassword,
				form.password || undefined,
			);
			if (success) {
				Alert.alert('Success', 'Profile updated successfully');
				router.back();
			}
		} catch (error) {
			Alert.alert(
				'Error',
				error instanceof Error ? error.message : 'Failed to update profile',
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className='relative flex-1 flex-col bg-primary'>
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
				Update Account
			</Text>
			<ScrollView>
				<CustomFormField
					title='Username'
					placeholder='Jane Doe'
					value={form.name}
					onChangeText={(text) => setForm({...form, name: text})}
				/>
				<CustomFormField
					title='Email'
					placeholder='jane.doe@example.com'
					value={form.email}
					onChangeText={(text) => setForm({...form, email: text})}
				/>
				<CustomFormField
					title='Current Password'
					placeholder='Enter current password'
					value={form.currentPassword}
					onChangeText={(text) => setForm({...form, currentPassword: text})}
				/>
				<CustomFormField
					title='New Password'
					placeholder='Enter new password'
					value={form.password}
					onChangeText={(text) => setForm({...form, password: text})}
				/>
				<View className='flex-row justify-between gap-3 mt-6'>
					<CustomButton
						onPress={() => router.back()}
						text='Cancel'
						otherStyles='flex-1 mx-5 my-5 py-4 px-5'
					/>
					<CustomButton
						onPress={submit}
						text={isSubmitting ? 'Updating...' : 'Update'}
						otherStyles='flex-1 mx-5 my-5 py-4 px-5'
						disabled={isSubmitting}
					/>
				</View>
			</ScrollView>
		</View>
	);
};

export default UpdateAccount;
