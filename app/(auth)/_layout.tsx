import {Stack} from 'expo-router';
import '../global.css';
const AuthLayout = () => {
	return (
		<Stack>
			<Stack.Screen
				name='signin'
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name='signup'
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name='index'
				options={{headerShown: false}}
			/>
		</Stack>
	);
};
export default AuthLayout;
