const APP_STRUCT = "HOME_SCREEN";

import React, { useState, useEffect } from "react";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { VStack } from "@/src/components/ui/vstack";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";
import FixedRoutesList from "@/src/components/FixedRoutesList";
import TripRequestList from "@/src/components/TripRequestList";
import { router } from "expo-router";
import { mockFixedRoutes } from "@/src/mockData/fixedRoutes";
import { setFixedRoutes } from "@/src/store/fixedRoutesSlice";
import { Platform, ScrollView } from "react-native";

export default function Home() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector(
    (state: RootState) => state.fixedRoutes.routes
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load mock data into Redux store
    dispatch(
      setFixedRoutes(mockFixedRoutes.map((v) => ({ ...v, driverId: user.id })))
    );
  }, []);

  const openAddModal = () => {
    router.navigate("create-fixed-route");
  };

  const userFixedRoutes = fixedRoutes.filter(
    (route) => route.driverId === user?.id
  );

  return (
    <Box className="flex-1 bg-gray-100 p-4">
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        showsVerticalScrollIndicator={Platform.OS === "web"}
        contentContainerStyle={{ width: '100%' }}
      >
        <VStack space="md" className="w-full">
          <Heading size="2xl" className="mb-4">
            Welcome to Xedi
          </Heading>
          <Heading size="lg" className="mb-6">
            Phone: {user?.phone}
          </Heading>

          {user?.role === "driver" && (
            <>
              <Input
                variant="outline"
                size="md"
                className="w-full mb-4"
              >
                <InputField
                  placeholder="Search routes..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </Input>

              {userFixedRoutes.length > 0 ? (
                <Box className="w-full mb-4">
                  <FixedRoutesList searchQuery={searchQuery} />
                </Box>
              ) : (
                <Button
                  size="lg"
                  className="w-full mb-4 bg-blue-500"
                  onPress={openAddModal}
                >
                  <ButtonText className="text-white">
                    Thêm tuyến cố định
                  </ButtonText>
                </Button>
              )}

              <Box className="w-full mb-4">
                <TripRequestList />
              </Box>
            </>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
}

