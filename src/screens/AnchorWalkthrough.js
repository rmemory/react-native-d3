/* eslint-disable react/jsx-indent, react/no-unused-state,
   react/jsx-indent-props, react/no-array-index-key */
import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	PanResponder,
	Dimensions,
	Animated,
} from 'react-native';
import loremipsum from 'lorem-ipsum-react-native';

import randomUser from '../randomUser';
import randomColor from '../randomColor';
import AnchorRadial from '../components/AnchorRadial';
import AnchorRadialChild from '../components/AnchorRadialChild';
import AnimatedLinearGradient from '../components/AnimatedLinearGradient';
import PanResponderTouchable from '../components/PanResponderTouchable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'gray',
		flex: 1,
	},
	pages: {
		flexDirection: 'row',
	},
	hero: {
		paddingTop: 100,
		paddingHorizontal: 50,
		width: SCREEN_WIDTH,
	},
	header: {
		fontSize: 35,
		fontWeight: 'bold',
		color: 'white',
		backgroundColor: 'transparent',
		marginBottom: 10,
	},
	text: {
		fontSize: 20,
		color: 'rgba(255, 255, 255, 0.5)',
		backgroundColor: 'transparent',
		marginBottom: 100,
	},
	circle: {
		position: 'absolute',
		alignSelf: 'center',
		width: 600,
		height: 600,
		borderRadius: 300,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		bottom: -300,
	},
	radial: {
		position: 'absolute',
		bottom: -300,
		alignSelf: 'center',
	},
	image: {
		width: 80,
		height: 80,
	},
});

const users = Array(8).fill().map(() => ({
	name: loremipsum({ count: 1, units: 'words' }),
	source: { uri: randomUser() },
	header: loremipsum({ count: 3, units: 'words' }),
	text: loremipsum({ count: 15, units: 'words' }),
	primaryColor: randomColor(),
	secondaryColor: randomColor(),
}));

export default class AnchorWalkthrough extends Component {
	state = {
		primaryColor: users[0].primaryColor,
		secondaryColor: users[0].secondaryColor,
		selected: 0,
		playing: null,
	}

	xOffset = new Animated.Value(0);

	panResponder = PanResponder.create({
		onMoveShouldSetPanResponderCapture: () => true,
		onPanResponderMove: this.onPanResponderMove,
		onPanResponderRelease: this.onPanResponderRelease,
	})

	onPanResponderMove = Animated.event(
		[null, { dx: this.xOffset }],
	)

	onPanResponderRelease = (...args) => {
		this.setState({ disableUsers: false });
		this.radial.onPanResponderRelease(...args);
	}

	render() {
		const {
			primaryColor,
			secondaryColor,
			selected,
			playing,
		} = this.state;

		return (
			// <View style={styles.container}>
			// 	<Animated.View
			// 		style={[styles.pages, { transform: [{ translateX: this.xOffset }] }]}
			// 		{...this.panResponder.panHandlers}
			// 	>
			// 		{users.map(({ source }, i) => (
			// 			<Image style={styles.image} source={source} />
			// 		))}
			// 	</Animated.View>
			// </View>
			<View style={styles.container}>
				<AnimatedLinearGradient colors={[
					primaryColor,
					secondaryColor,
				]}
				/>

				<Animated.View
					style={[styles.pages, { transform: [{ translateX: this.xOffset }] }]}
					{...this.panResponder.panHandlers}
				>
					{users.map(({ header, text }, i) => (
						<View key={i} style={styles.hero}>
							<Text style={styles.header}>{header}</Text>
							<Text style={styles.text}>{text}</Text>
						</View>
					))}
				</Animated.View>
				<View style={styles.circle} />
				<AnchorRadial
					ref={c => (this.radial = c)}
					style={styles.radial}
					xOffset={this.xOffset}
					onValueChanged={(i) => {
						const { newPrimaryColor, newSecondaryColor } = users[i];
						this.setState({
							primaryColor: newPrimaryColor,
							secondaryColor: newSecondaryColor,
							selected: i,
						});
					}}
					value={selected}
				>
					{users.map(({ source }, i) => (
						<AnchorRadialChild key={i} playing={playing === i}>
							<PanResponderTouchable
								onPressOut={() => {
									if (selected === i) {
										this.setState({
											playing: i,
										});
									}
									this.setState({
										selected: i,
									});
								}}
							>
								<Image style={styles.image} source={source} />
							</PanResponderTouchable>
						</AnchorRadialChild>
					))}
				</AnchorRadial>
			</View>
		);
	}
}
