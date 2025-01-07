const APP_STRUCT = 'ROOT_GROUP_LAYOUT';

import React from "react";
import { Tabs } from "expo-router";
import HomeIcon from "@/src/components/icons/HomeIcon";
import MotoIcon from "@/src/components/icons/MotoIcon";
import ProfileIcon from "@/src/components/icons/ProfileIcon";

export default function RootGroupLayout() {
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

