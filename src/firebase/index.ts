"use client";

import { useMemo } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useFirebase } from './client-provider';

function useAuth() {
    const { auth } = useFirebase();
    const [user, loading, error] = useAuthState(auth);

    return useMemo(() => ({
        user,
        loading,
        error
    }), [user, loading, error]);
}

export { useAuth, useFirebase };
