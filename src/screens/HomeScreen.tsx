import React from 'react';
import { View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, ButtonText, VStack, Heading } from '@gluestack-ui/themed';
import { RootState } from '@/src/store';
import { logout } from '@/src/features/auth/authSlice';
import { RouteName, RouteParamsList } from '@/src/types/route';

type HomeScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Home>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate(RouteName.Login);
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <VStack space="md" alignItems="center">
        <Heading size="xl">Welcome, {user?.name}!</Heading>
        <Button onPress={() => navigation.navigate(RouteName.Booking)}>
          <ButtonText>Book a Ride</ButtonText>
        </Button>
        <Button onPress={() => navigation.navigate(RouteName.BookingsHistory)}>
          <ButtonText>View Booking History</ButtonText>
        </Button>
        <Button variant="outline" onPress={handleLogout}>
          <ButtonText>Logout</ButtonText>
        </Button>
      </VStack>
    </View>
  );
}

