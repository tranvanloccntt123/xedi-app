import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import HomeScreen from '@/src/screens/HomeScreen';
import CustomerHomeScreen from '@/src/screens/CustomerHomeScreen';
import BookingHistoryScreen from '@/src/screens/BookingsHistoryScreen';
import SettingScreen from '@/src/screens/SettingScreen';
import { RouteName } from '@/src/types/route';
import { RootState } from '@/src/store';

const Tab = createBottomTabNavigator();

export function MainTab() {
  const user = useSelector((state: RootState) => state.auth.user);

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
      <Tab.Screen 
        name={RouteName.Home} 
        component={user?.role === 'driver' ? HomeScreen : CustomerHomeScreen} 
      />
      <Tab.Screen name={RouteName.BookingsHistory} component={BookingHistoryScreen} />
      <Tab.Screen name={RouteName.Settings} component={SettingScreen} />
    </Tab.Navigator>
  );
}

