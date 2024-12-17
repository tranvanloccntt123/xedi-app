import React from 'react';
import { FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from "@/src/components/ui/button";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Box } from "@/src/components/ui/box";
import { Card } from "@/src/components/ui/card";
import { RootState } from '@/src/store';
import { logout } from '@/src/features/auth/authSlice';
import { RouteName, RouteParamsList } from '@/src/types/route';
import { useRealm, useQuery } from '@/src/hooks/useRealm';
import { FixedRoute, TripRequest, User } from '@/src/models/RealmModels';
import Realm from "realm";

type HomeScreenNavigationProp = StackNavigationProp<RouteParamsList, RouteName.Home>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const realm = useRealm();
  const fixedRoutes = useQuery<FixedRoute>(FixedRoute);
  const tripRequests = useQuery<TripRequest>(TripRequest);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate(RouteName.Login);
  };

  const handleCreateNewJourney = () => {
    navigation.navigate(RouteName.CreateFixedRoute);
  };

  const userFixedRoutes = fixedRoutes.filtered('driverId == $0', new Realm.BSON.ObjectId(user?._id));
  const pendingTripRequests = tripRequests.filtered('status == $0', 'pending');

  const renderTripRequest = ({ item }: { item: TripRequest }) => (
    <Card className="mb-4 p-4">
      <Text className="font-bold mb-2">Trip Request</Text>
      <Text>From: {item.startLocation}</Text>
      <Text>To: {item.endLocation}</Text>
      <Text>Departure: {item.departureTime.toLocaleString()}</Text>
      <Button onPress={() => navigation.navigate(RouteName.TripRequestDetails, { requestId: item._id.toHexString() })} className="mt-2 bg-blue-500">
        <Text className="text-white">View Details</Text>
      </Button>
    </Card>
  );

  return (
    <Box className="flex-1 bg-gray-100 p-6">
      <VStack space="md" className="items-center">
        <Text className="text-2xl font-bold mb-6">
          Xin chào, {user?.name}
        </Text>
        {user?.role === 'driver' && userFixedRoutes.length === 0 && (
          <Button onPress={handleCreateNewJourney} className="w-full bg-green-500 rounded-md mb-4">
            <Text className="text-white font-semibold">Tạo hành trình mới</Text>
          </Button>
        )}
        {user?.role === 'driver' && (
          <>
            <Text className="text-xl font-semibold mb-4">Pending Trip Requests</Text>
            <FlatList
              data={pendingTripRequests}
              renderItem={renderTripRequest}
              keyExtractor={(item) => item._id.toHexString()}
              className="w-full"
              ListEmptyComponent={<Text className="text-center">No pending trip requests</Text>}
            />
          </>
        )}
        {user?.role === 'customer' && (
          <Button onPress={() => navigation.navigate(RouteName.Booking)} className="w-full bg-blue-500 rounded-md mb-4">
            <Text className="text-white font-semibold">Book a Ride</Text>
          </Button>
        )}
        <Button onPress={() => navigation.navigate(RouteName.BookingsHistory)} className="w-full bg-green-500 rounded-md mb-4">
          <Text className="text-white font-semibold">View Booking History</Text>
        </Button>
        <Button variant="outline" onPress={handleLogout} className="w-full border-red-500 rounded-md">
          <Text className="text-red-500 font-semibold">Logout</Text>
        </Button>
      </VStack>
    </Box>
  );
}

