import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Text } from '@gluestack-ui/themed';
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
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.details}>Pickup: {booking.pickup}</Text>
      <Text style={styles.details}>Drop-off: {booking.dropoff}</Text>
      <Text style={styles.details}>Ride Type: {booking.rideType}</Text>
      <Text style={styles.message}>Your ride will arrive shortly. Thank you for using Xedi Ride!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

