import React from 'react';
import { useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { RootState } from '../store';
import { RouteName, RouteParamsList } from '../types/route';

type ConfirmationScreenRouteProp = RouteProp<RouteParamsList, RouteName.Confirmation>;

export default function ConfirmationScreen() {
  const route = useRoute<ConfirmationScreenRouteProp>();
  const { bookingId } = route.params;
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-500">Booking not found</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 p-6 justify-center items-center bg-gray-100">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <VStack space="md">
          <Text className="text-3xl font-bold text-green-600 text-center">Booking Confirmed!</Text>
          <Text className="text-lg">Pickup: {booking.pickup}</Text>
          <Text className="text-lg">Drop-off: {booking.dropoff}</Text>
          <Text className="text-lg">Ride Type: {booking.rideType}</Text>
          <Text className="text-base text-center text-gray-600">
            Your ride will arrive shortly. Thank you for using Xedi Ride!
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

