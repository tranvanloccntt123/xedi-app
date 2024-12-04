import React from 'react';
import { useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { RootState } from '../store';
import { RouteName, RouteParamsList } from '../types/route';

type ConfirmationScreenRouteProp = RouteProp<RouteParamsList, RouteName.Confirmation>;

export default function ConfirmationScreen() {
  const route = useRoute<ConfirmationScreenRouteProp>();
  const { bookingId } = route.params;
  const { bookings } = useSelector((state: RootState) => state.bookings);
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return <Text>Booking not found</Text>;
  }

  return (
    <Box className="flex-1 p-6 justify-center items-center bg-gray-100">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Text className="text-3xl font-bold mb-6 text-green-600 text-center">Booking Confirmed!</Text>
        <Text className="text-lg mb-2">Pickup: {booking.pickup}</Text>
        <Text className="text-lg mb-2">Drop-off: {booking.dropoff}</Text>
        <Text className="text-lg mb-4">Ride Type: {booking.rideType}</Text>
        <Text className="text-base text-center text-gray-600">Your ride will arrive shortly. Thank you for using Xedi Ride!</Text>
      </Box>
    </Box>
  );
}

