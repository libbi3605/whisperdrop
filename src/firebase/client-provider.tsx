'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { app } from './config';
import { FirebaseProvider, type FirebaseContextType } from './provider';

const FirebaseClientContext = createContext<FirebaseContextType | null>(null);

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebaseContextValue = useMemo(() => {
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    if (process.env.NEXT_PUBLIC_EMULATORS_ENABLED === 'true') {
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    }
    
    return {
      auth,
      firestore,
      app,
    };
  }, []);

  return (
    <FirebaseClientContext.Provider value={firebaseContextValue}>
      <FirebaseProvider value={firebaseContextValue}>{children}</FirebaseProvider>
    </FirebaseClientContext.Provider>
  );
}

export const useFirebase = () => {
    const context = useContext(FirebaseClientContext);
    if (context === null) {
        throw new Error('useFirebase must be used within a FirebaseClientProvider');
    }
    return context;
}
