import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import ClerkProviderWrapper from "../context/ClerkProvider";

/**
 * Applies authentication-aware routing and renders the application's stack layout.
 *
 * Redirects signed-in users who are inside the auth group to the home route ("/"), and redirects users who are not signed in and are outside the auth group to the sign-in route ("/(auth)/signin"). Navigation happens after auth state is loaded.
 *
 * @returns A Stack layout containing the "(auth)" and "index" screens with headers hidden.
 */
function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      // Redirect to home if signed in and in auth group
      router.replace("/");
    } else if (!isSignedIn && !inAuthGroup) {
      // Redirect to sign-in if not signed in and not in auth group
      router.replace("/(auth)/signin");
    }
  }, [isSignedIn, isLoaded, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

/**
 * Wraps the application's initial layout with the Clerk provider.
 *
 * @returns A React element containing `ClerkProviderWrapper` that renders `InitialLayout` as its child.
 */
export default function RootLayout() {
  return (
    <ClerkProviderWrapper>
      <InitialLayout />
    </ClerkProviderWrapper>
  );
}
