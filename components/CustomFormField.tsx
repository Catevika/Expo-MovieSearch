import {images} from '@/constants/images';
import {useState} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';

const CustomFormField = ({
	title,
	value,
	placeholder,
	onChangeText,
	otherStyles,
}: FieldProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const isPasswordField = title.toLowerCase().includes('password');

	return (
		<View className='mx-5 mb-5'>
			<Text className='text-white mb-2'>{title}</Text>
			<View className='relative'>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor='#a8b5db'
					secureTextEntry={isPasswordField && !showPassword}
					className={`bg-dark-200 text-light-200 rounded-lg p-5 ${otherStyles}`}
				/>
				{isPasswordField && (
					<TouchableOpacity
						onPress={() => setShowPassword(!showPassword)}
						className='absolute right-4 top-5'>
						<Image
							source={showPassword ? images.eyeHide : images.eye}
							className='size-6'
							tintColor='#a8b5db'
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default CustomFormField;
