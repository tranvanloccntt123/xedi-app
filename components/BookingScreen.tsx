import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BookingScreen() {
  const navigation = useNavigation();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('standard');

  const handleBooking = () => {
    // In a real app, you would send this data to your backend
    navigation.navigate('Confirmation', { pickup, dropoff, rideType });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Pickup Location"
        value={pickup}
        onChangeText={setPickup}
      />
      <TextInput
        style={styles.input}
        placeholder="Drop-off Location"
        value={dropoff}
        onChangeText={setDropoff}
      />
      <View style={styles.rideTypeContainer}>
        <TouchableOpacity
          style={[styles.rideTypeButton, rideType === 'standard' && styles.selectedRideType]}
          onPress={() => setRideType('standard')}
        >
          <Text>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.rideTypeButton, rideType === 'premium' && styles.selectedRideType]}
          onPress={() => setRideType('premium')}
        >
          <Text>Premium</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBooking}
      >
        <Text style={styles.bookButtonText}>Book Ride</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  rideTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rideTypeButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedRideType: {
    backgroundColor: '#007AFF',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

