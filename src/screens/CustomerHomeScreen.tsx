import React from "react";
import { FlatList } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { Card } from "@/src/components/ui/card";
import { RootState } from "@/src/store";
import { RouteName, RouteParamsList } from "@/src/types/route";
import { useQuery } from "@/src/hooks/useRealm";
import { FixedRoute, TripRequest } from "@/src/models/RealmModels";
import Realm from "realm";
import { Header } from "@/src/components/Header";

type CustomerHomeScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Home
>;

export default function CustomerHomeScreen() {
  const navigation = useNavigation<CustomerHomeScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useQuery<FixedRoute>(FixedRoute);
  const tripRequests = useQuery<TripRequest>(TripRequest);

  const handleBookRide = () => {
    navigation.navigate(RouteName.Booking);
  };

  const availableFixedRoutes = fixedRoutes.filtered("availableSeats > $0", 0);
  const userTripRequests = tripRequests.filtered(
    "customerId == $0",
    new Realm.BSON.ObjectId(user?._id)
  );

  const renderFixedRoute = ({ item }: { item: FixedRoute }) => (
    <Card className="mb-4 p-4">
      <Text className="font-bold mb-2">Available Fixed Route</Text>
      <Text>From: {item.startLocation}</Text>
      <Text>To: {item.endLocation}</Text>
      <Text>Departure: {item.departureTime.toLocaleString()}</Text>
      <Text>Available Seats: {item.availableSeats}</Text>
      <Text>Price: ${item.price.toFixed(2)}</Text>
      <Button
        onPress={() =>
          navigation.navigate(RouteName.TripRequestForFixedRoute, {
            fixedRouteId: item._id.toHexString(),
            customerId: user?._id,
          })
        }
        className="mt-2 bg-blue-500"
      >
        <Text className="text-white">Request This Route</Text>
      </Button>
    </Card>
  );

  const renderTripRequest = ({ item }: { item: TripRequest }) => (
    <Card className="mb-4 p-4">
      <Text className="font-bold mb-2">Your Trip Request</Text>
      <Text>From: {item.startLocation}</Text>
      <Text>To: {item.endLocation}</Text>
      <Text>Departure: {item.departureTime.toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
    </Card>
  );

  return (
    <Box className="flex-1 bg-white">
      <Header 
        title="Home" 
        subtitle={`Welcome, ${user?.name}`}
      />
      <Box className="flex-1 p-6">
        <VStack space="md">
          <Box className="mb-6">
            <Text className="mb-6 text-lg text-black">
              Bắt đầu chuyến đi mới ngay thôi
            </Text>
            <Button
              onPress={handleBookRide}
              className="w-full bg-primary-800 rounded-md mb-1 h-[50px]"
            >
              <Text className="text-white font-semibold">
                Đặt chuyến đi mới
              </Text>
            </Button>
          </Box>
          <Text className="text-xl font-semibold mb-4">
            Available Fixed Routes
          </Text>
          <FlatList
            data={availableFixedRoutes}
            renderItem={renderFixedRoute}
            keyExtractor={(item) => item._id.toHexString()}
            className="w-full"
            ListEmptyComponent={
              <Text className="text-center">
                No available fixed routes at the moment
              </Text>
            }
          />
          <Text className="text-xl font-semibold mb-4 mt-6">
            Your Trip Requests
          </Text>
          <FlatList
            data={userTripRequests}
            renderItem={renderTripRequest}
            keyExtractor={(item) => item._id.toHexString()}
            className="w-full"
            ListEmptyComponent={
              <Text className="text-center">
                You haven't made any trip requests yet
              </Text>
            }
          />
        </VStack>
      </Box>
    </Box>
  );
}

