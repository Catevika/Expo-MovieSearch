import {
	account,
	createUser as createAppwriteUser,
	createUserSession,
	updateUserProfile,
} from '@/services/appwrite';

export const signIn = async (email: string, password: string) => {
	try {
		return await createUserSession(email, password);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Invalid credentials';
		throw new Error(message);
	}
};

export const signOut = async () => {
	try {
		const sessions = await account.listSessions();
		await Promise.all(
			sessions.sessions.map((session) => account.deleteSession(session.$id)),
		);
		return {success: true};
	} catch (error: any) {
		console.error('Sign out error:', error);
		throw new Error('Unable to sign out. Please try again.');
	}
};

export const createUser = async (
	email: string,
	password: string,
	name: string,
) => {
	try {
		return await createAppwriteUser(email, password, name);
	} catch (error) {
		const message =
			error instanceof Error ? error.message : 'Failed to create account';
		throw new Error(message);
	}
};

export const checkAuth = async () => {
	try {
		const user = await account.get();
		return {success: true, user};
	} catch (error) {
		return {success: false};
	}
};

export const updateUser = async (
	name: string,
	email: string,
	currentPassword: string,
	newPassword?: string,
) => {
	try {
		const response = await updateUserProfile(
			name,
			email,
			currentPassword,
			newPassword,
		);
		if (response.success) {
			const {user} = await checkAuth();
			return {success: true, user};
		}
		throw new Error('Failed to update profile');
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'Failed to update profile',
		);
	}
};
