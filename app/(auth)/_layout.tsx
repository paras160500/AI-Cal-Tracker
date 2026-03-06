import { Stack } from 'expo-router';

/**
 * Defines the layout for the auth route group.
 *
 * Renders an Expo Router `Stack` configured for authentication screens with the header hidden and a 'fade' transition animation.
 *
 * @returns A JSX element rendering the configured `Stack` for auth routes.
 */
export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade',
            }}
        />
    );
}
