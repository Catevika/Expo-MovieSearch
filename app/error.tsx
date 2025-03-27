import ErrorBoundary from '@/components/ErrorBoundary';
import {useRouter} from 'expo-router';

const ErrorScreen = () => {
	const router = useRouter();

	return (
		<ErrorBoundary
			error={new Error('An unexpected error occurred')}
			retry={() => router.replace('/(tabs)/home')}
		/>
	);
};

export default ErrorScreen;
