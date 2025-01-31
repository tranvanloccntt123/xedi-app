import { useDispatch } from "react-redux"
import { setUser, clearUser } from "@/src/store/userSlice"
import { setAuthenticated, logout, clearAuthData } from "@/src/store/authSlice"
import { clearFixedRoutes } from "@/src/store/fixedRoutesSlice"
import { clearTripRequests } from "@/src/store/tripRequestsSlice"

const APP_STRUCT = "ROOT_LAYOUT"

import "@/global.css"
import "react-native-url-polyfill/auto"

import React, { useEffect } from "react"
import { Slot, useRouter, useSegments } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "../src/store/store"
import { useSelector } from "react-redux"
import type { RootState } from "../src/store/store"
import { supabase } from "@/src/lib/supabase"
import { Platform } from "react-native"
import type { IUser } from "@/src/types"

function AuthWrapper() {
  const router = useRouter()
  const segments = useSegments()
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)"

    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/sign-in")
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/")
    }
  }, [isAuthenticated, segments, router])

  const dispatch = useDispatch()
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        console.log("User signed in:", session?.user)
        if (session?.user) {
          const user: IUser = {
            id: session.user.id,
            name: session.user.user_metadata.name || "",
            phone: session.user.phone || "",
            email: session.user.email || "",
            role: session.user.user_metadata.role || "customer",
            createdAt: new Date(session.user.created_at),
          }
          dispatch(setUser(user))
          dispatch(setAuthenticated(user))
        }
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out")
        dispatch(logout())
        dispatch(clearFixedRoutes())
        dispatch(clearTripRequests())
        dispatch(clearAuthData())
        dispatch(clearUser())
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [dispatch])

  return <Slot />
}

export default function RootLayout() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GluestackUIProvider mode="light">
          <StatusBar style="auto" />
          <AuthWrapper />
        </GluestackUIProvider>
      </PersistGate>
    </Provider>
  )
}

