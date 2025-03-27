import CustomTabIcon from '@/components/CustomTabIcon';
import {icons} from '@/constants/icons';
import {useAuth} from '@/context/AuthProvider';
import {router, Tabs} from 'expo-router';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Keyboard, Platform, View} from 'react-native';

export default function TabsLayout() {
	const {isLoading, isAuthenticated} = useAuth();
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const redirect = () => {
			if (!isAuthenticated) {
				router.replace('/signin');
			}
		};

		redirect();
	}, [isAuthenticated]);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			'keyboardDidShow',
			() => {
				setKeyboardVisible(true);
			},
		);
		const keyboardDidHideListener = Keyboard.addListener(
			'keyboardDidHide',
			() => {
				setKeyboardVisible(false);
			},
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

	if (isLoading) {
		return (
			<View className='flex-1 justify-center items-center bg-primary'>
				<ActivityIndicator
					size='large'
					color='#ab8bff'
				/>
			</View>
		);
	}

	if (!isAuthenticated) {
		return null;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarItemStyle: {
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabBarHideOnKeyboard: true,
				tabBarStyle: {
					position: 'absolute',
					left: 20,
					right: 20,
					bottom: Platform.OS === 'ios' ? 36 : 24,
					height: 52,
					backgroundColor: '#0F0D23',
					borderRadius: 50,
					borderWidth: 1,
					borderColor: '#0F0D23',
					marginHorizontal: 15,
					display: isKeyboardVisible ? 'none' : 'flex',
				},
			}}>
			<Tabs.Screen
				name='home'
				options={{
					title: 'home',
					headerShown: false,
					tabBarIcon: ({focused}) => (
						<CustomTabIcon
							focused={focused}
							icon={icons.home}
							title='Home'
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='search'
				options={{
					title: 'Search',
					headerShown: false,
					tabBarIcon: ({focused}) => (
						<CustomTabIcon
							focused={focused}
							icon={icons.search}
							title='Search'
						/>
					),
				}}
			/>
			<Tabs.Screen
				name='saved'
				options={{
					title: 'Saved',
					headerShown: false,
					tabBarIcon: ({focused}) => (
						<CustomTabIcon
							focused={focused}
							icon={icons.save}
							title='Saved'
						/>
					),
				}}
			/>

			<Tabs.Screen
				name='profile'
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({focused}) => (
						<CustomTabIcon
							focused={focused}
							icon={icons.person}
							title='Profile'
						/>
					),
				}}
			/>
		</Tabs>
	);
}
