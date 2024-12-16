import React from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
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
  const navigation = useNavigation();
  const { requestId } = route.params;
  const realm = useRealm();

  const tripRequest = realm.objectForPrimaryKey<TripRequest>('TripRequest', new Realm.BSON.ObjectId(requestId));

  const handleAccept = () => {
    if (tripRequest) {
      realm.write(() => {
        tripRequest.status = 'accepted';
      });
      navigation.goBack();
    }
  };

  const handleReject = () => {
    if (tripRequest) {
      realm.write(() => {
        tripRequest.status = 'rejected';
      });
      navigation.goBack();
    }
  };

  if (!tripRequest) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-xl text-red-500">Trip request not found</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-gray-100 p-6">
      <Card className="mb-6">
        <CardHeader>
          <Text className="text-2xl font-bold text-blue-600">Trip Request Details</Text>
        </CardHeader>
        <CardContent>
          <VStack space="md">
            <Text className="text-lg"><Text className="font-semibold">From:</Text> {tripRequest.startLocation}</Text>
            <Text className="text-lg"><Text className="font-semibold">To:</Text> {tripRequest.endLocation}</Text>
            <Text className="text-lg"><Text className="font-semibold">Departure:</Text> {tripRequest.departureTime.toLocaleString()}</Text>
            <Text className="text-lg"><Text className="font-semibold">Status:</Text> {tripRequest.status}</Text>
            <Text className="text-lg"><Text className="font-semibold">Request Time:</Text> {tripRequest.requestTime.toLocaleString()}</Text>
          </VStack>
        </CardContent>
      </Card>
      <VStack space="md">
        <Button onPress={handleAccept} className="bg-green-500 rounded-md" disabled={tripRequest.status !== 'pending'}>
          <Text className="text-white font-semibold">Accept Request</Text>
        </Button>
        <Button onPress={handleReject} className="bg-red-500 rounded-md" disabled={tripRequest.status !== 'pending'}>
          <Text className="text-white font-semibold">Reject Request</Text>
        </Button>
      </VStack>
    </Box>
  );
}

