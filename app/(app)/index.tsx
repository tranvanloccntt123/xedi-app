import React from 'react';
import { Link, useRouter } from 'expo-router';
import { Box } from '@/src/components/ui/box';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { Center } from '@/src/components/ui/center';
import { Heading } from '@/src/components/ui/heading';
import { VStack } from '@/src/components/ui/vstack';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/src/store/authSlice';
import { RootState } from '@/src/store/store';

export default function Home() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <Center className="flex-1 bg-gray-100">
      <VStack space="md" className="items-center">
        <Heading size="2xl" className="mb-4">Welcome to Xedi</Heading>
        <Heading size="lg" className="mb-6">Phone: {user?.phone}</Heading>
        <Link href="/ride" asChild>
          <Button size="lg" className="w-64 mb-4 bg-blue-500">
            <ButtonText className="text-white">Book a Ride</ButtonText>
          </Button>
        </Link>
        <Link href="/food" asChild>
          <Button size="lg" className="w-64 mb-4 bg-green-500">
            <ButtonText className="text-white">Order Food</ButtonText>
          </Button>
        </Link>
        <Button size="lg" className="w-64 bg-red-500" onPress={handleLogout}>
          <ButtonText className="text-white">Logout</ButtonText>
        </Button>
      </VStack>
    </Center>
  );
}

