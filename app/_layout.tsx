import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/src/store/userSlice";
import { setAuthenticated, logout, clearAuthData } from "@/src/store/authSlice";
import { clearFixedRoutes } from "@/src/store/fixedRoutesSlice";
import { clearTripRequests } from "@/src/store/tripRequestsSlice";
import { fetchUserInfo } from "@/src/store/userThunks";

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
import type { IUser } from "@/src/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

  const dispatch = useDispatch();
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          console.log("User signed in:", session?.user);
          if (session?.user) {
            dispatch(fetchUserInfo());
            dispatch(setAuthenticated(true));
          }
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
          dispatch(logout());
          dispatch(clearFixedRoutes());
          dispatch(clearTripRequests());
          dispatch(clearAuthData());
          dispatch(clearUser());
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [dispatch]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GluestackUIProvider mode="light">
            <StatusBar style="auto" />
            <AuthWrapper />
          </GluestackUIProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
