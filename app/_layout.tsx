import "@/global.css";

import React from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store/store';
import { useSelector } from 'react-redux';
import { RootState } from '../src/store/store';

function AuthWrapper() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  React.useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isAuthenticated, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode='light'>
          <StatusBar style="auto" />
          <AuthWrapper />
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}

