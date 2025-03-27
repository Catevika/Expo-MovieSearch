import {useState} from 'react';
import {Pressable, Text} from 'react-native';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

const CustomButton = ({onPress, text, disabled, otherStyles}: buttonProps) => {
	const [pressed, setPressed] = useState(false);

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{scale: withSpring(pressed ? 0.95 : 1)}],
		};
	});

	return (
		<Animated.View style={animatedStyle}>
			<Pressable
				onPress={onPress}
				onPressIn={() => setPressed(true)}
				onPressOut={() => setPressed(false)}
				disabled={disabled}
				className={`py-3.5 rounded-lg flex-row items-center justify-center ${
					disabled ? 'bg-accent/50' : 'bg-accent'
				} ${otherStyles}`}>
				<Text
					className={`font-semibold text-base ${
						disabled ? 'text-white' : 'text-dark-200'
					}`}>
					{text}
				</Text>
			</Pressable>
		</Animated.View>
	);
};

export default CustomButton;
