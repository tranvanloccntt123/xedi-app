const APP_STRUCT = "TABS_LAYOUT";

import React from "react";
import { Tabs } from "expo-router";
import HomeIcon from "@/src/components/icons/HomeIcon";
import MotoIcon from "@/src/components/icons/MotoIcon";
import ProfileIcon from "@/src/components/icons/ProfileIcon";
import NotificationIcon from "@/src/components/icons/Notifications";
import { useDispatch } from "react-redux";
import { fetchUserCoins, fetchMyUserInfo } from "@/src/store/user/userThunks";
import AppColors from "@/src/constants/colors";

export default function TabsLayout() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchMyUserInfo());
    dispatch(fetchUserCoins());
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppColors.primary,
        tabBarInactiveTintColor: AppColors.placeholder,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ride"
        options={{
          title: "Chuyến đi",
          tabBarIcon: ({ color, size }) => (
            <MotoIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "Hoạt động",
          tabBarIcon: ({ color, size }) => (
            <NotificationIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color, size }) => (
            <ProfileIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
