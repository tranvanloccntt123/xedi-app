import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, Select, Text } from '@gluestack-ui/themed';
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
        userId: user.id,
        pickup,
        dropoff,
        rideType,
      }));
      navigation.navigate(RouteName.Confirmation, { bookingId: 'temp-id' });
    }
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
        style={styles.input}
      />
      <Input
        placeholder="Drop-off Location"
        value={dropoff}
        onChangeText={setDropoff}
        style={styles.input}
      />
      <Select
        selectedValue={rideType}
        onValueChange={setRideType}
        style={styles.input}
      >
        <Select.Item label="Standard" value="standard" />
        <Select.Item label="Premium" value="premium" />
      </Select>
      <Button onPress={handleBooking} disabled={isLoading}>
        <Text>{isLoading ? 'Booking...' : 'Book Ride'}</Text>
      </Button>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

