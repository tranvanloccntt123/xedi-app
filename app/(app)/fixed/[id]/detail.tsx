const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/src/store/store";
import { deleteFixedRoute } from "@/src/store/fixedRoutesSlice";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { ScrollView } from "react-native";
import FixedRouteItem from "@/src/components/FixedRouteItem";

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const route = useSelector((state: RootState) =>
    state.fixedRoutes.routes.find((r) => r.id === id)
  );

  if (!route) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Text>Không tìm thấy tuyến đường</Text>
      </Box>
    );
  }

  const handleDelete = () => {
    dispatch(deleteFixedRoute(route.id));
    router.back();
  };

  return (
    <Box className="flex-1 bg-gray-100">
      <ScrollView style={{ flex: 1 }}>
        <Box className="flex-1 p-4 bg-gray-100">
          <VStack space="md">
            <Heading size="xl">Chi tiết tuyến cố định</Heading>
            <FixedRouteItem fixedRoute={route} disabled />
            <VStack space="md" className="mx-2">
              <Button onPress={() => router.push(`/fixed/${route.id}/edit`)}>
                <ButtonText>Chỉnh sửa tuyến đường</ButtonText>
              </Button>
              <Button variant="outline" onPress={handleDelete}>
                <ButtonText>Xóa tuyến đường</ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </Box>
  );
}

