import { ClerkLoaded, ClerkProvider } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';

const tokenCache = {
    async getToken(key: string) {
        try {
            const item = await SecureStore.getItemAsync(key);
            return item;
        } catch (error) {
            console.error('SecureStore get item error: ', error);
            await SecureStore.deleteItemAsync(key);
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return await SecureStore.setItemAsync(key, value);
        } catch (err) {
            console.error('SecureStore set item error:', err);
            return;
        }
    },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
    throw new Error(
        'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    );
}

export default function ClerkProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
            <ClerkLoaded>{children}</ClerkLoaded>
        </ClerkProvider>
    );
}
