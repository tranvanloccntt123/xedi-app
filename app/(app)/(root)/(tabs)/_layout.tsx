const APP_STRUCT = "TABS_LAYOUT"

import React from "react"
import { Tabs } from "expo-router"
import HomeIcon from "@/src/components/icons/HomeIcon"
import MotoIcon from "@/src/components/icons/MotoIcon"
import ProfileIcon from "@/src/components/icons/ProfileIcon"
import HiIcon from "@/src/components/icons/HiIcon"

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => <HomeIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: "Chuyến đi",
          tabBarIcon: ({ color, size }) => <MotoIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trip-requests"
        options={{
          title: "Yêu cầu",
          tabBarIcon: ({ color, size }) => <HiIcon size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, size }) => <ProfileIcon size={size} color={color} />,
        }}
      />
    </Tabs>
  )
}

