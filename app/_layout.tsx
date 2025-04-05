import { useDispatch } from "react-redux";
import { clearUser } from "@/src/store/user/userSlice";
import {
  setAuthenticated,
  logout,
  clearAuthData,
} from "@/src/store/auth/authSlice";
import { clearFixedRoutes } from "@/src/store/fixedRoute/fixedRoutesSlice";
import { fetchUserCoins, fetchMyUserInfo } from "@/src/store/user/userThunks";
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
import { supabase, xediSupabase } from "@/src/lib/supabase";

import { Box } from "@/src/components/ui/box";
import { Platform } from "react-native";
import DebugButton from "@/src/components/DebugButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { registerNotification } from "@/src/firebase/messaging";
import CheckUpdateModal from "@/src/components/CheckUpdateModal";

import { startNetworkLogging } from "react-native-network-logger";

import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { XediFonts } from "@/src/theme/AppStyles";

startNetworkLogging();

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

  useEffect(() => {
    if (isAuthenticated) {
      registerNotification()
        .then(async (token) => {
          const userId = (await xediSupabase.getUser())?.data?.user?.id;
          const { data } = await xediSupabase.tables.profiles.selectById(
            userId
          );
          if (!data.length) {
            xediSupabase.tables.profiles.add([
              { id: userId, fcm_token: token },
            ]);
          } else {
            xediSupabase.tables.profiles.updateById(userId, {
              fcm_token: token,
            });
          }
        })
        .catch((e) => console.warn(e));
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          if (session?.user) {
            dispatch(fetchMyUserInfo());
            dispatch(fetchUserCoins());
            dispatch(setAuthenticated(true));
          }
        } else if (event === "SIGNED_OUT") {
          dispatch(logout());
          dispatch(clearFixedRoutes());
          dispatch(clearAuthData());
          dispatch(clearUser());
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Box className="flex-1">
      <CheckUpdateModal />
      <Slot />
      {Platform.OS !== "web" && (
        <DebugButton onPress={() => router.navigate("(app)/network-debug")} />
      )}
    </Box>
  );
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(XediFonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

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
