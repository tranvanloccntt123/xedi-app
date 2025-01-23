const APP_STRUCT = "ROOT_GROUP_LAYOUT"

import React from "react"
import { Redirect, Stack } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/src/store/store"

export default function RootGroupLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />
  }
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="edit-profile"
        options={{
          presentation: "modal",
          title: "Chỉnh sửa hồ sơ",
        }}
      />
    </Stack>
  )
}

