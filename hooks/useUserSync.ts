import { useUser } from '@clerk/clerk-expo';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect } from 'react';
import { db } from '../config/firebase';

export const useUserSync = () => {
    const { user } = useUser();

    useEffect(() => {
        const syncUser = async () => {
            if (!user) return;

            // Check if Firebase is likely configured
            if (!process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID) {
                console.warn('⚠️ Firebase Project ID is missing. Firestore sync will not work. Please check your .env file.');
                return;
            }

            try {
                const userRef = doc(db, 'users', user.id);
                const userDoc = await getDoc(userRef);

                if (!userDoc.exists()) {
                    await setDoc(userRef, {
                        email: user.primaryEmailAddress?.emailAddress,
                        fullName: user.fullName,
                        imageUrl: user.imageUrl,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp(),
                    }, { merge: true });
                    console.log('✅ User synced to Firestore');
                }
            } catch (error: any) {
                console.error('❌ Error syncing user to Firestore:', error);

                if (error.code === 'unavailable') {
                    console.warn('Firestore is currently unavailable (offline). Check your internet or Firebase keys.');
                }
            }
        };

        syncUser();
    }, [user]);
};
