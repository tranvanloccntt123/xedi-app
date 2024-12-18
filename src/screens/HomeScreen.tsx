import React from "react";
import { FlatList, SafeAreaView } from "react-native";
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
import AppStyles from "@/src/themes/styles";
import { Divider } from "../components/ui/divider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type HomeScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.Home
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useQuery<FixedRoute>(FixedRoute);
  const tripRequests = useQuery<TripRequest>(TripRequest);
  const insets = useSafeAreaInsets();

  const handleCreateNewJourney = () => {
    navigation.navigate(RouteName.CreateFixedRoute);
  };

  const userFixedRoutes = fixedRoutes.filtered(
    "driverId == $0",
    new Realm.BSON.ObjectId(user?._id)
  );
  const pendingTripRequests = tripRequests.filtered("status == $0", "pending");

  const renderTripRequest = ({ item }: { item: TripRequest }) => (
    <Card className="mb-4 p-4">
      <Text className="font-bold mb-2">Trip Request</Text>
      <Text>From: {item.startLocation}</Text>
      <Text>To: {item.endLocation}</Text>
      <Text>Departure: {item.departureTime.toLocaleString()}</Text>
      <Button
        onPress={() =>
          navigation.navigate(RouteName.TripRequestDetails, {
            requestId: item._id.toHexString(),
          })
        }
        className="mt-2 bg-blue-500"
      >
        <Text className="text-white">View Details</Text>
      </Button>
    </Card>
  );

  return (
    <Box className="flex-1 bg-white">
      <Box className="flex-1">
        <VStack space="md">
          <Box className="bg-green-500 p-6">
            <Box style={{paddingTop: insets.top}}>
              <Text className="text-2xl font-bold mb-6 text-black">
                Xin chào, {user?.name}
              </Text>
              {user?.role === "driver" && userFixedRoutes.length === 0 && (
                <Box className="mb-6">
                  <Text className="mb-6 text-lg text-black">
                    Bắt đầu ngày mới ngay thôi
                  </Text>
                  <Button
                    onPress={handleCreateNewJourney}
                    className="w-full bg-primary-800 rounded-md mb-1 h-[50px]"
                  >
                    <Text className="text-white font-semibold">
                      Tạo hành trình mới
                    </Text>
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
          <Box className="p-6">
            {user?.role === "driver" && (
              <>
                <Text className="text-xl font-semibold mb-4">
                  Pending Trip Requests
                </Text>
                <FlatList
                  data={pendingTripRequests}
                  renderItem={renderTripRequest}
                  keyExtractor={(item) => item._id.toHexString()}
                  className="w-full"
                  ListEmptyComponent={
                    <Text className="text-center">
                      No pending trip requests
                    </Text>
                  }
                />
              </>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
