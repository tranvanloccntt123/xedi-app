import React from 'react';
import { Box } from '@/src/components/ui/box';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { Heading } from '@/src/components/ui/heading';
import { VStack } from '@/src/components/ui/vstack';
import { Text } from '@/src/components/ui/text';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/src/store/authSlice';
import { RootState } from '@/src/store/store';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/sign-in');
  };

  return (
    <Box className="flex-1 bg-gray-100 p-4">
      <VStack space="md" className="items-center">
        <Heading size="2xl" className="mb-4">Profile</Heading>
        <Text className="mb-2">Name: {user?.name}</Text>
        <Text className="mb-2">Phone: {user?.phone}</Text>
        <Text className="mb-2">Email: {user?.email}</Text>
        <Text className="mb-2">Role: {user?.role}</Text>
        <Button size="lg" className="w-64 bg-red-500 mt-4" onPress={handleLogout}>
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}

