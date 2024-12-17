import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from "@/src/components/ui/button";
import { Input, InputField } from "@/src/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
  SelectItem
} from "@/src/components/ui/select";
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { createBookingRequest } from '../features/bookings/bookingsSlice';
import { RootState } from '../store';
import { RouteName, RouteParamsList } from '../types/route';

type BookingScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Booking>;

export default function BookingScreen() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('standard');
  const dispatch = useDispatch();
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isLoading, error } = useSelector((state: RootState) => state.bookings);

  const handleBooking = () => {
    if (user) {
      dispatch(createBookingRequest({
        userId: user._id,
        pickup,
        dropoff,
        rideType,
      }));
      navigation.navigate(RouteName.Confirmation, { bookingId: 'temp-id' });
    }
  };

  return (
    <Box className="flex-1 p-6 bg-gray-100">
      <VStack space="md" className="bg-white p-6 rounded-lg shadow-md">
        <Input>
          <InputField 
            placeholder="Pickup Location" 
            value={pickup} 
            onChangeText={setPickup}
          />
        </Input>
        <Input>
          <InputField 
            placeholder="Drop-off Location" 
            value={dropoff} 
            onChangeText={setDropoff}
          />
        </Input>
        <Select
          selectedValue={rideType}
          onValueChange={setRideType}
        >
          <SelectTrigger variant="outline" size="md" className="mb-4 p-3 border-gray-300 rounded-md">
            <SelectInput placeholder="Select Ride Type" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Standard" value="standard" />
              <SelectItem label="Premium" value="premium" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <Button onPress={handleBooking} disabled={isLoading} className="bg-blue-500 rounded-md">
          <Text className="text-white font-semibold">{isLoading ? 'Booking...' : 'Book Ride'}</Text>
        </Button>
        {error && <Text className="text-red-500 mt-2">{error}</Text>}
      </VStack>
    </Box>
  );
}

