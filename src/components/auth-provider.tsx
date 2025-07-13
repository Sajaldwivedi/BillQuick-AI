"use client";

import { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { AuthContextType } from '@/hooks/use-auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only set up auth listener if Firebase is initialized
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // If Firebase is not initialized, just set loading to false
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = { user, loading, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
