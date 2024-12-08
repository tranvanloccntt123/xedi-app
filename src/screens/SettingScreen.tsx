import React from 'react';
import { View } from 'react-native';
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { useNavigation } from '@react-navigation/native';
import { RouteName } from '@/src/types/route';

export default function SettingScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    // Implement logout logic here
    navigation.navigate(RouteName.Login);
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <VStack space="md" className="w-full max-w-sm">
        <Text className="text-2xl font-bold mb-4">Settings</Text>
        <Button onPress={() => navigation.navigate(RouteName.UserProfile, { userId: 'currentUserId' })}>
          <Text className="text-white">Edit Profile</Text>
        </Button>
        <Button onPress={handleLogout} className="bg-red-500">
          <Text className="text-white">Logout</Text>
        </Button>
      </VStack>
    </View>
  );
}

