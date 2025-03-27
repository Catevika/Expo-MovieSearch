import {checkAuth, signIn, signOut} from '@/services/auth';
import {router} from 'expo-router';
import {createContext, useContext, useEffect, useState} from 'react';
import {Alert} from 'react-native';
import type {Models} from 'react-native-appwrite';

type User = Models.User<Models.Preferences>;
type AuthContextType = {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: {children: React.ReactNode}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		checkAuthStatus();
	}, []);

	const checkAuthStatus = async () => {
		try {
			setIsLoading(true);
			const {success, user} = await checkAuth();
			if (success && user) {
				setUser(user);
				setIsAuthenticated(true);
			}
		} catch (error: any) {
			setUser(null);
			setIsAuthenticated(false);
			Alert.alert('Authentication Error', 'Please sign in again');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSignIn = async (email: string, password: string) => {
		try {
			const {user} = await signIn(email, password);
			setUser(user);
			setIsAuthenticated(true);
			router.replace('/home');
		} catch (error: any) {
			Alert.alert('Sign In Error', error.message || 'Failed to sign in');
			throw error;
		}
	};

	const handleSignOut = async () => {
		try {
			setIsLoading(true);
			await signOut();
			setUser(null);
			setIsAuthenticated(false);
			await checkAuthStatus();
		} catch (error: any) {
			console.error('Sign out error:', error);
			Alert.alert('Sign Out Error', 'Failed to sign out properly');
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				signIn: handleSignIn,
				signOut: handleSignOut,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
};

export default AuthProvider;
