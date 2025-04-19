import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function useAuthUserId(): string | null {
    const [uid, setUid] = useState<string | null>(null);

    useEffect(() => {
        const ensureAuth = async () => {
            if (!auth.currentUser) {
                const result = await signInAnonymously(auth);
                setUid(result.user.uid);
            } else {
                setUid(auth.currentUser.uid);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, () => {
            ensureAuth();
        });

        return () => unsubscribe();
    }, []);

    return uid;
}
