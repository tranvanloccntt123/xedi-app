import React, { createContext, useContext, useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// Define the context type
type AuthContextType = {
  isAuthenticated: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType>({ isAuthenticated: false });

// Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

