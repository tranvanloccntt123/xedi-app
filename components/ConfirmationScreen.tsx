import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function ConfirmationScreen() {
  const route = useRoute();
  const { pickup, dropoff, rideType } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed!</Text>
      <Text style={styles.details}>Pickup: {pickup}</Text>
      <Text style={styles.details}>Drop-off: {dropoff}</Text>
      <Text style={styles.details}>Ride Type: {rideType}</Text>
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

