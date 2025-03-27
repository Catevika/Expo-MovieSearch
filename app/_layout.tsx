import AuthProvider from '@/context/AuthProvider';
import {Barlow_400Regular, useFonts} from '@expo-google-fonts/barlow';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import './global.css';

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Barlow_400Regular,
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<AuthProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: {backgroundColor: '#030014'},
				}}>
				<Stack.Screen
					name='(auth)'
					options={{
						animation: 'slide_from_right',
						animationDuration: 300,
						gestureEnabled: true,
						gestureDirection: 'horizontal',
					}}
				/>
				<Stack.Screen
					name='(tabs)'
					options={{
						animation: 'fade',
						animationDuration: 300,
					}}
				/>
				<Stack.Screen
					name='movie/[id]'
					options={{
						animation: 'slide_from_right',
						animationDuration: 200,
						presentation: 'card',
					}}
				/>
				<Stack.Screen
					name='+not-found'
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name='error'
					listeners={{
						beforeRemove: (e) => {
							e.preventDefault();
						},
					}}
				/>
				<Stack.Screen
					name='update-account'
					options={{
						animation: 'slide_from_right',
						animationDuration: 200,
						presentation: 'card',
					}}
				/>
			</Stack>
		</AuthProvider>
	);
}
