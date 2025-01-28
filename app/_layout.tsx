const APP_STRUCT = "ROOT_LAYOUT";

import "@/global.css";
import "react-native-url-polyfill/auto";

import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../src/store/store";
import { useSelector } from "react-redux";
import type { RootState } from "../src/store/store";
import { supabase } from "@/src/lib/supabase";

function AuthWrapper() {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/sign-in");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/");
    }
  }, [isAuthenticated, segments, router]);

  return <Slot />;
}

export default function RootLayout() {
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("No user signed in");
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          console.log("User signed in:", session?.user);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode="light">
          <StatusBar style="auto" />
          <AuthWrapper />
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  );
}
