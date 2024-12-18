import React, { useState } from "react";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRealm } from "@/src/hooks/useRealm";
import { FixedRoute } from "@/src/models/RealmModels";
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Card } from "@/src/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/src/components/ui/select";
import { RouteName, RouteParamsList } from "@/src/types/route";
import { SafeAreaView } from 'react-native-safe-area-context';
import AppStyles from "@/src/themes/styles";

type TripRequestForFixedRouteScreenRouteProp = RouteProp<
  RouteParamsList,
  RouteName.TripRequestForFixedRoute
>;
type TripRequestForFixedRouteScreenNavigationProp = StackNavigationProp<
  RouteParamsList,
  RouteName.TripRequestForFixedRoute
>;

export function TripRequestForFixedRouteScreen() {
  const realm = useRealm();
  const [requestType, setRequestType] = useState<"join" | "cancel">("join");
  const [error, setError] = useState<string | null>(null);
  const route = useRoute<TripRequestForFixedRouteScreenRouteProp>();
  const navigation =
    useNavigation<TripRequestForFixedRouteScreenNavigationProp>();
  const { fixedRouteId, customerId } = route.params;

  const fixedRoute = realm.objectForPrimaryKey<FixedRoute>(
    "FixedRoute",
    new Realm.BSON.ObjectId(fixedRouteId)
  );

  const submitTripRequestForFixedRoute = () => {
    try {
      realm.write(() => {
        realm.create("TripRequestForFixedRoute", {
          _id: new Realm.BSON.ObjectId(),
          fixedRouteId: new Realm.BSON.ObjectId(fixedRouteId),
          customerId: new Realm.BSON.ObjectId(customerId),
          requestType,
          status: "pending",
          requestTime: new Date(),
          updatedAt: new Date(),
        });
      });
      navigation.goBack();
    } catch (e) {
      setError("Failed to submit request. Please try again.");
    }
  };

  if (!fixedRoute) {
    return (
      <Box className="flex-1 bg-white">
        <SafeAreaView style={AppStyles.container}>
          <Box className="flex-1 justify-center items-center bg-gray-100">
            <Text className="text-xl text-red-500">Fixed route not found</Text>
          </Box>
        </SafeAreaView>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={AppStyles.container}>
        <Box className="flex-1 bg-gray-100 p-6">
          <Card className="mb-6">
            <Text className="text-2xl font-bold text-blue-600">
              Fixed Route Details
            </Text>
            <VStack space="md">
              <Text className="text-lg">
                <Text className="font-semibold">From:</Text>{" "}
                {fixedRoute.startLocation}
              </Text>
              <Text className="text-lg">
                <Text className="font-semibold">To:</Text> {fixedRoute.endLocation}
              </Text>
              <Text className="text-lg">
                <Text className="font-semibold">Departure:</Text>{" "}
                {fixedRoute.departureTime.toLocaleString()}
              </Text>
              <Text className="text-lg">
                <Text className="font-semibold">Available Seats:</Text>{" "}
                {fixedRoute.availableSeats}
              </Text>
              <Text className="text-lg">
                <Text className="font-semibold">Price:</Text> $
                {fixedRoute.price.toFixed(2)}
              </Text>
            </VStack>
          </Card>
          <VStack space="md">
            <Text className="text-xl font-bold mb-2">Request for Fixed Route</Text>
            <Select
              selectedValue={requestType}
              onValueChange={(value) => setRequestType(value as "join" | "cancel")}
            >
              <SelectTrigger className="bg-white border border-gray-300 rounded-md p-3">
                <SelectInput placeholder="Select Request Type" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Join" value="join" />
                  <SelectItem label="Cancel" value="cancel" />
                </SelectContent>
              </SelectPortal>
            </Select>
            <Button
              onPress={submitTripRequestForFixedRoute}
              className="bg-blue-500 rounded-md"
            >
              <Text className="text-white font-semibold">Submit Request</Text>
            </Button>
            {error && <Text className="text-red-500 mt-2">{error}</Text>}
          </VStack>
        </Box>
      </SafeAreaView>
    </Box>
  );
}

