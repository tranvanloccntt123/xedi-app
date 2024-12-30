import "@/global.css";

import React from 'react';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../src/store/store';
import { AuthProvider } from '../src/contexts/auth';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode='light'>
          <AuthProvider>
            <StatusBar style="auto" />
            <Slot />
          </AuthProvider>
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}

