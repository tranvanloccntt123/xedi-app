const APP_STRUCT = "TRIP_REQUEST_LIST";

import React, { useCallback, useEffect } from "react";
import { FlatList } from "react-native";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import {
  updateTripRequest,
  setTripRequests,
} from "@/src/store/tripRequestsSlice";
import type { ITripRequest } from "@/src/types";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import LottieView from "lottie-react-native";
import Lottie from "../lottie";
import { router } from "expo-router";
import { mockTripRequests } from "@/src/mockData/tripRequests";
import moment from "moment";
import { Heading } from "./ui/heading";
import { Badge } from "@/src/components/ui/badge";

export default function TripRequestList() {
  const dispatch = useDispatch();
  const tripRequests = useSelector(
    (state: RootState) => state.tripRequests.requests
  );
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Load mock data into Redux store
    dispatch(setTripRequests(mockTripRequests));
  }, [dispatch]);

  const pendingRequests = tripRequests.filter(
    (request) =>
      request.status === "pending" &&
      !request.riderRequests.includes(user?.id || "")
  );

  const handleRequestTrip = (requestId: string) => {
    if (user?.id) {
      dispatch(updateTripRequest({ id: requestId, riderId: user.id }));
      // Navigate to the chat screen
      router.push(`/chat/${requestId}`);
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: ITripRequest; index: number }) => {
      const month = moment(item?.departureTime).format("MM/YYYY");
      const upMonth =
        index &&
        moment(pendingRequests[index - 1]?.departureTime).format("MM/YYYY");
      return (
        <Box className="px-4 mb-[15px] w-full">
          {(index === 0 || month !== upMonth) && (
            <Heading size="xs" className="mb-2 text-bold text-primary-600">
              Tháng {month}
            </Heading>
          )}
          <VStack space="xs" className="mx-2 bg-white p-4 rounded-md">
            <HStack className="justify-between">
              <Text className="text-xs font-bold">
                {moment(item?.departureTime).format("HH:mm")}
              </Text>
              <Badge
                size="sm"
                variant={"solid"}
                action={item.type === "Taxi" ? "success" : "warning"}
                className="text-xs rounded-md"
              >
                <Text>
                  {item.type === "Taxi" ? "Đón trả khách" : "Giao hàng"}
                </Text>
              </Badge>
            </HStack>
            <VStack>
              <HStack className="items-center">
                <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
                  <Box className="rounded-full w-full h-full bg-error-500" />
                </Box>
                <Text className="font-black font-normal text-sm">
                  {item.startLocation}
                </Text>
              </HStack>
              <Box className="w-[15px] h-[5px] justify-center items-center">
                <Box className="rounded-full w-[3px] h-[3px] bg-primary-100" />
              </Box>
              <Box className="w-[15px] h-[5px] justify-center items-center">
                <Box className="rounded-full w-[3px] h-[3px] bg-primary-100" />
              </Box>
              <HStack className="items-center">
                <Box className="w-[15px] h-[15px] p-[3px] justify-center items-center">
                  <Box className="rounded-full w-full h-full bg-error-100" />
                </Box>
                <Text className="font-black font-normal text-sm">
                  {item.endLocation}
                </Text>
              </HStack>
            </VStack>
            <HStack space="sm" className="justify-end mt-2">
              <Button
                size="xs"
                className="bg-blue-500 rounded-lg"
                onPress={() => handleRequestTrip(item.id)}
              >
                <ButtonText className="text-white">Nhắn tin</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>
      );
    },
    []
  );

  return (
    <Box className="w-full">
      <FlatList
        data={pendingRequests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Box className="w-full">
            <LottieView
              source={Lottie.RIDE}
              colorFilters={[]}
              style={{ width: "100%", height: 200 }}
              autoPlay
              loop
            />
            <Text className="text-center font-bold">
              Hiện tại không có yêu cầu chuyến đi nào.
            </Text>
          </Box>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </Box>
  );
}

