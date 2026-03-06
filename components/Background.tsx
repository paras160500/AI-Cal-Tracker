import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

/**
 * Premium Live Organic Background.
 * Uses fluid, slow-moving blobs with varied colors and blurs
 * to create a silky, natural iOS-inspired feel.
 */
export default function Background() {
    const anim1 = useSharedValue(0);
    const anim2 = useSharedValue(0);
    const anim3 = useSharedValue(0);

    React.useEffect(() => {
        const duration = 15000;
        const easing = Easing.inOut(Easing.sin);

        anim1.value = withRepeat(
            withSequence(
                withTiming(1, { duration, easing }),
                withTiming(0, { duration, easing })
            ),
            -1
        );
        anim2.value = withRepeat(
            withSequence(
                withTiming(1, { duration: duration * 1.2, easing }),
                withTiming(0, { duration: duration * 1.2, easing })
            ),
            -1
        );
        anim3.value = withRepeat(
            withSequence(
                withTiming(1, { duration: duration * 0.8, easing }),
                withTiming(0, { duration: duration * 0.8, easing })
            ),
            -1
        );
    }, []);

    const blob1Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(anim1.value, [0, 1], [-50, 50]) },
            { translateY: interpolate(anim1.value, [0, 1], [-30, 100]) },
            { scale: interpolate(anim1.value, [0, 1], [1, 1.2]) },
        ],
    }));

    const blob2Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(anim2.value, [0, 1], [width * 0.5, width * 0.7]) },
            { translateY: interpolate(anim2.value, [0, 1], [height * 0.6, height * 0.4]) },
            { scale: interpolate(anim2.value, [0, 1], [1.2, 0.9]) },
        ],
    }));

    const blob3Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: interpolate(anim3.value, [0, 1], [width * 0.1, width * 0.4]) },
            { translateY: interpolate(anim3.value, [0, 1], [height * 0.8, height * 0.7]) },
            { scale: interpolate(anim3.value, [0, 1], [0.8, 1.1]) },
        ],
    }));

    return (
        <View style={styles.container}>
            {/* Pure White/Light Gray Base */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#F0F4F8' }]} />

            {/* Organic Shapes - Inspired by nature colors in user image */}
            <Animated.View style={[styles.blob, styles.blobYellow, blob1Style]} />
            <Animated.View style={[styles.blob, styles.blobGreen, blob2Style]} />
            <Animated.View style={[styles.blob, styles.blobPurple, blob3Style]} />
            <Animated.View style={[styles.blob, styles.blobBlue, { top: height * 0.2, left: width * 0.6, width: 200, height: 200, borderRadius: 100 }]} />

            {/* Frosting Layer - Silky Blur */}
            <BlurView intensity={70} style={StyleSheet.absoluteFillObject} tint="light" />

            {/* Glass Overlays for Depth */}
            <LinearGradient
                colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.6)']}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    blob: {
        position: 'absolute',
        opacity: 0.5,
    },
    blobYellow: {
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: '#FFD700', // Vibrant Yellow from image
        top: -80,
        left: -100,
    },
    blobGreen: {
        width: 400,
        height: 400,
        borderRadius: 150, // Slightly irregular
        backgroundColor: '#22C55E', // Lush Green from image
        bottom: 100,
        right: -100,
    },
    blobPurple: {
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#8B5CF6', // Nature Purple from image
        bottom: -50,
        left: 20,
    },
    blobBlue: {
        backgroundColor: '#3B82F6', // Clear Blue from image
        opacity: 0.3,
    },
});
