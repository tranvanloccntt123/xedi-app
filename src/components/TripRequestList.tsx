const APP_STRUCT = "TRIP_REQUEST_LIST";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import { updateTripRequest } from "@/src/store/tripRequestsSlice";
import { ITripRequest } from "@/src/types";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import LottieView from "lottie-react-native";
import Lottie from "../lottie";

export default function TripRequestList() {
  const tripRequests = useSelector(
    (state: RootState) => state.tripRequests.requests
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const pendingRequests = tripRequests.filter(
    (request) =>
      request.status === "pending" &&
      !request.riderRequests.includes(user?.id || "")
  );

  const handleRequestTrip = (requestId: string) => {
    if (user?.id) {
      dispatch(updateTripRequest({ id: requestId, riderId: user.id }));
    }
  };

  const renderItem = (item: ITripRequest) => (
    <Box
      key={item.id}
      className="bg-white p-4 mb-2 rounded-md shadow-sm w-full"
    >
      <VStack space="xs">
        <Text className="font-bold">
          {item.startLocation} đến {item.endLocation}
        </Text>
        <Text>Khởi hành: {new Date(item.departureTime).toLocaleString()}</Text>
        <Text>
          Thời gian yêu cầu: {new Date(item.requestTime).toLocaleString()}
        </Text>
        <Text>Trạng thái: {item.status}</Text>
        <Text>Số người quan tâm: {item.riderRequests.length}</Text>
        <HStack space="sm" className="justify-end mt-2">
          <Button
            size="sm"
            className="bg-blue-500"
            onPress={() => handleRequestTrip(item.id)}
          >
            <ButtonText className="text-white">Yêu cầu chuyến đi</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );

  if (pendingRequests.length === 0) {
    return (
      <Box className="w-full">
        <LottieView
          source={Lottie.RIDE}
          colorFilters={[]}
          style={{ width: "100%", height: "100%" }}
          autoPlay
          loop
        />
        <Text className="text-center font-bold">
          Đi thôi, đừng để khách đợi!
        </Text>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <Heading size="md" className="mb-2">
        Yêu cầu chuyến đi
      </Heading>
      <VStack space="md">{pendingRequests.map(renderItem)}</VStack>
    </Box>
  );
}
