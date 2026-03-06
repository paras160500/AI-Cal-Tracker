import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import ClerkProviderWrapper from "../context/ClerkProvider";

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
  }, [isSignedIn, isLoaded, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ClerkProviderWrapper>
      <InitialLayout />
    </ClerkProviderWrapper>
  );
}
