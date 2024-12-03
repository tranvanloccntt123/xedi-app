import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Text } from "@/src/components/ui/text";
import { fetchBookingsRequest } from "../features/bookings/bookingsSlice";
import { RootState } from "../store";

export default function BookingsHistoryScreen() {
  const dispatch = useDispatch();
  const { bookings, isLoading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookingsRequest());
  }, [dispatch]);

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingItem}>
      <Text>Pickup: {item.pickup}</Text>
      <Text>Drop-off: {item.dropoff}</Text>
      <Text>Ride Type: {item.rideType}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  if (isLoading) {
    return <Text>Loading bookings...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History</Text>
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bookingItem: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

