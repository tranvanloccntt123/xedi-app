import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { RouteName, RouteParamsList } from '@/src/types/route';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/src/features/auth/authSlice';
import { RootState } from '@/src/store';

type SettingScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Settings>;

export default function SettingScreen() {
  const navigation = useNavigation<SettingScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate(RouteName.Login);
  };

  return (
    <Box className="flex-1 bg-gray-100 p-6">
      <VStack space="md" className="w-full max-w-sm mx-auto">
        <Text className="text-3xl font-bold mb-6">Settings</Text>
        <Button 
          onPress={() => navigation.navigate(RouteName.UserProfile, { userId: user?._id })}
          className="bg-blue-500 rounded-md"
        >
          <Text className="text-white font-semibold">Edit Profile</Text>
        </Button>
        <Button 
          onPress={() => navigation.navigate(RouteName.VehicleRegistration, { driverId: user?._id })}
          className="bg-green-500 rounded-md"
        >
          <Text className="text-white font-semibold">Manage Vehicle</Text>
        </Button>
        <Button 
          onPress={handleLogout} 
          className="bg-red-500 rounded-md mt-4"
        >
          <Text className="text-white font-semibold">Logout</Text>
        </Button>
      </VStack>
    </Box>
  );
}

