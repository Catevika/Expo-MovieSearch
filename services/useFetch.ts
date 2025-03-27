import {useCallback, useEffect, useState} from 'react';
import {Alert} from 'react-native';

const useFetch = <T>(options: UseFetchOptions<T>): UseFetchResult<T> => {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await options.fetchFunction();
			setData(result);
		} catch (error) {
			console.error('Detailed useFetch error:', {
				errorName: error instanceof Error ? error.name : 'Unknown Error',
				errorMessage: error instanceof Error ? error.message : 'No message',
				errorStack: error instanceof Error ? error.stack : 'No stack trace',
			});
			setError(
				error instanceof Error ? error : new Error('An unknown error occurred'),
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRefresh = useCallback(() => {
		try {
			fetchData();
		} catch (error) {
			Alert.alert('Error', 'Failed to refresh data');
		}
	}, []);

	const reset = () => {
		setData(null);
		setIsLoading(false);
		setError(null);
	};

	useEffect(() => {
		if (options.autoFetch) {
			fetchData();
		}
	}, [options.autoFetch]);

	return {
		data,
		isLoading,
		error,
		refetch: fetchData,
		refresh: handleRefresh,
		reset,
	};
};

export default useFetch;
