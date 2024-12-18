import React, { useEffect } from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Spinner } from "@/src/components/ui/spinner";
import { fetchBookingsRequest } from '../features/bookings/bookingsSlice';
import { RootState } from '../store';
import AppStyles from "@/src/themes/styles";

// Removed the inline AppStyles definition

export default function BookingsHistoryScreen() {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookingsRequest());
  }, [dispatch]);

  const renderBookingItem = ({ item }) => (
    <Box className="bg-gray-100 p-4 mb-4 rounded-lg">
      <VStack space="xs">
        <Text className="text-gray-600">Pickup: {item.pickup}</Text>
        <Text className="text-gray-600">Drop-off: {item.dropoff}</Text>
        <Text className="text-gray-600">Ride Type: {item.rideType}</Text>
        <Text className="text-gray-600">Status: {item.status}</Text>
      </VStack>
    </Box>
  );

  if (isLoading) {
    return (
      <Box className="flex-1 bg-white">
        <SafeAreaView style={AppStyles.container}>
          <Box className="flex-1 justify-center items-center">
            <Spinner size="large" />
            <Text className="mt-4">Loading bookings...</Text>
          </Box>
        </SafeAreaView>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 bg-white">
        <SafeAreaView style={AppStyles.container}>
          <Box className="flex-1 justify-center items-center">
            <Text className="text-red-500 text-lg">{error}</Text>
          </Box>
        </SafeAreaView>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 p-6 bg-white">
          <Text className="text-2xl font-bold mb-6">Booking History</Text>
          <FlatList
            data={bookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
}

