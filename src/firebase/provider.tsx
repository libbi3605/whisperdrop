'use client';

import React, { createContext, useContext } from 'react';
import type { Auth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';

export interface FirebaseContextType {
  auth: Auth;
  firestore: Firestore;
  app: FirebaseApp;
}

const FirebaseContext = createContext<FirebaseContextType | null>('');

export function FirebaseProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: FirebaseContextType;
}) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebaseContext = () => {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error('useFirebaseContext must be used within a FirebaseProvider');
  }
  return context;
};
