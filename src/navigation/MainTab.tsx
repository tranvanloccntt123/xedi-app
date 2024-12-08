import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '@/src/screens/HomeScreen';
import BookingHistoryScreen from '@/src/screens/BookingsHistoryScreen';
import SettingScreen from '@/src/screens/SettingScreen';
import { RouteName } from '@/src/types/route';

const Tab = createBottomTabNavigator();

export function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === RouteName.Home) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === RouteName.BookingsHistory) {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === RouteName.Settings) {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName as never} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name={RouteName.Home} component={HomeScreen} />
      <Tab.Screen name={RouteName.BookingsHistory} component={BookingHistoryScreen} />
      <Tab.Screen name={RouteName.Settings} component={SettingScreen} />
    </Tab.Navigator>
  );
}

