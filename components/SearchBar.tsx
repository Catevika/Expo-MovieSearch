import {icons} from '@/constants/icons';
import {Image, TextInput, TouchableOpacity, View} from 'react-native';

const SearchBar = ({
	value,
	onChangeText,
	onSubmitEditing,
	onReset,
}: SearchBarProps) => {
	return (
		<View className='flex-row items-center px-5'>
			<View className='flex-1 flex-row items-center gap-2 bg-dark-200 rounded-full px-5 py-4'>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					onSubmitEditing={onSubmitEditing}
					placeholder='Search movies...'
					placeholderTextColor='#a8b5db'
					className='flex-1 text-light-200 ml-2'
					returnKeyType='search'
				/>
				<TouchableOpacity
					onPress={value ? onReset : onSubmitEditing}
					className='rounded-full bg-accent p-3'>
					<Image
						source={value ? icons.close : icons.search}
						className='size-5'
						tintColor='#0f0d23'
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SearchBar;
