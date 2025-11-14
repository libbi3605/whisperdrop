"use client";

import { useMemo } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { app } from './config';

// Custom hook to get the currently authenticated user
import { useAuthState } from 'react-firebase-hooks/auth';

function useAuth() {
    const auth = getAuth(app);
    const [user, loading, error] = useAuthState(auth);

    return useMemo(() => ({
        user,
        loading,
        error
    }), [user, loading, error]);
}


export { useAuth };
