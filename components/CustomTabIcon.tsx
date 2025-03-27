import {images} from '@/constants/images';
import {Image, ImageBackground, Text} from 'react-native';

const CustomTabIcon = ({focused, icon, title}: any) => {
	if (focused) {
		return (
			<ImageBackground
				source={images.highlight}
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: 112,
					width: '100%',
					height: 52,
					gap: 5,
					borderRadius: 50,
					overflow: 'hidden',
				}}>
				<Image
					source={icon}
					tintColor='#151312'
					className='size-5'
				/>
				<Text className='text-secondary text-xxs font-semibold'>{title}</Text>
			</ImageBackground>
		);
	}

	return (
		<Image
			source={icon}
			tintColor='#A8B5DB'
			className='size-5'
		/>
	);
};

export default CustomTabIcon;
