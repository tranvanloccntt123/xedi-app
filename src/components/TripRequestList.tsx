import React from 'react';
import { FlatList } from 'react-native';
import { Box } from '@/src/components/ui/box';
import { Text } from '@/src/components/ui/text';
import { Heading } from '@/src/components/ui/heading';
import { Button } from '@/src/components/ui/button';
import { ButtonText } from '@/src/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/src/store/store';
import { updateTripRequest } from '@/src/store/tripRequestsSlice';
import { ITripRequest } from '@/src/types';

export default function TripRequestList() {
  const user = useSelector((state: RootState) => state.auth.user);
  const tripRequests = useSelector((state: RootState) => state.tripRequests.requests);
  const dispatch = useDispatch();

  const filteredRequests = tripRequests.filter(
    (request) => request.status === 'pending'
  );

  const handleAccept = (requestId: string) => {
    dispatch(updateTripRequest({ id: requestId, status: 'accepted' }));
  };

  const handleReject = (requestId: string) => {
    dispatch(updateTripRequest({ id: requestId, status: 'rejected' }));
  };

  const renderItem = ({ item }: { item: ITripRequest }) => (
    <Box className="bg-white p-4 mb-2 rounded-md shadow-sm">
      <Text className="font-bold">{item.startLocation} to {item.endLocation}</Text>
      <Text>Departure: {new Date(item.departureTime).toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
      <Box className="flex-row justify-end mt-2">
        <Button size="sm" className="mr-2 bg-green-500" onPress={() => handleAccept(item.id)}>
          <ButtonText className="text-white">Accept</ButtonText>
        </Button>
        <Button size="sm" className="bg-red-500" onPress={() => handleReject(item.id)}>
          <ButtonText className="text-white">Reject</ButtonText>
        </Button>
      </Box>
    </Box>
  );

  if (filteredRequests.length === 0) {
    return (
      <Box>
        <Heading size="md" className="mb-2">Trip Requests</Heading>
        <Text>No pending trip requests.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading size="md" className="mb-2">Trip Requests</Heading>
      <FlatList
        data={filteredRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </Box>
  );
}

