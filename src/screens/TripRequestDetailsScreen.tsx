import React from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Button } from "@/src/components/ui/button";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Box } from "@/src/components/ui/box";
import { Card, CardHeader, CardContent } from "@/src/components/ui/card";
import { useRealm } from '@/src/hooks/useRealm';
import { TripRequest } from '@/src/models/RealmModels';
import { RouteName, RouteParamsList } from '@/src/types/route';

type TripRequestDetailsScreenRouteProp = RouteProp<RouteParamsList, RouteName.TripRequestDetails>;

export default function TripRequestDetailsScreen() {
  const route = useRoute<TripRequestDetailsScreenRouteProp>();
  const { requestId } = route.params;
  const realm = useRealm();

  const tripRequest = realm.objectForPrimaryKey<TripRequest>('TripRequest', requestId);

  const handleAccept = () => {
    if (tripRequest) {
      realm.write(() => {
        tripRequest.status = 'accepted';
      });
    }
  };

  const handleReject = () => {
    if (tripRequest) {
      realm.write(() => {
        tripRequest.status = 'rejected';
      });
    }
  };

  if (!tripRequest) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Trip request not found</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100 p-6">
      <Card className="mb-4">
        <CardHeader>
          <Text className="text-xl font-bold">Trip Request Details</Text>
        </CardHeader>
        <CardContent>
          <VStack space="md">
            <Text>From: {tripRequest.startLocation}</Text>
            <Text>To: {tripRequest.endLocation}</Text>
            <Text>Departure: {tripRequest.departureTime.toLocaleString()}</Text>
            <Text>Status: {tripRequest.status}</Text>
            <Text>Request Time: {tripRequest.requestTime.toLocaleString()}</Text>
          </VStack>
        </CardContent>
      </Card>
      <VStack space="md">
        <Button onPress={handleAccept} className="bg-green-500">
          <Text className="text-white font-semibold">Accept Request</Text>
        </Button>
        <Button onPress={handleReject} className="bg-red-500">
          <Text className="text-white font-semibold">Reject Request</Text>
        </Button>
      </VStack>
    </Box>
  );
}

