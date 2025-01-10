const APP_STRUCT = "ROOT_GROUP_LAYOUT";

import React from "react";
import { Redirect, Tabs } from "expo-router";
import HomeIcon from "@/src/components/icons/HomeIcon";
import MotoIcon from "@/src/components/icons/MotoIcon";
import ProfileIcon from "@/src/components/icons/ProfileIcon";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

export default function RootGroupLayout() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  if (!isAuthenticated) {
    return <Redirect href="/sign-in" />;
  }
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: "Ride",
          tabBarIcon: ({ color, size }) => (
            <MotoIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

