const APP_STRUCT = "HOME_SCREEN";

import React, { useEffect } from "react";
import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { VStack } from "@/src/components/ui/vstack";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import TripRequestList from "@/src/components/TripRequestList";
import { Platform, ScrollView } from "react-native";
import { mockTripRequests } from "@/src/mockData/tripRequests";
import { setTripRequests } from "@/src/store/tripRequestsSlice";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Load mock data into Redux store
    dispatch(setTripRequests(mockTripRequests));
  }, []);

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        contentContainerStyle={{ width: "100%" }}
      >
        <VStack space="md" className="w-full p-4">
          <Heading size="lg" className="mb-4">
            Xin Chào, {user?.phone}
          </Heading>
          <Box className="w-full mb-4">
            <TripRequestList />
          </Box>
        </VStack>
      </ScrollView>
    </Box>
  );
}

