import {NativeEventEmitter} from 'react-native';

const eventEmitter = new NativeEventEmitter();

export const movieEvents = {
	emit: (event: string) => eventEmitter.emit(event),
	addListener: (event: string, callback: () => void) =>
		eventEmitter.addListener(event, callback),
	removeListener: (event: string) => {
		eventEmitter.removeAllListeners(event);
	},
};

export const MOVIE_SAVED = 'MOVIE_SAVED';
export const MOVIE_REMOVED = 'MOVIE_REMOVED';
