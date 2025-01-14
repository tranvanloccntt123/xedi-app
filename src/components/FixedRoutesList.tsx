const APP_STRUCT = 'FIXED_ROUTES_LIST';

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { Heading } from "@/src/components/ui/heading";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { IFixedRoute } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { router } from "expo-router";
import { Pressable } from "react-native";

interface FixedRoutesListProps {
  searchQuery: string;
}

export default function FixedRoutesList({ searchQuery }: FixedRoutesListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector(
    (state: RootState) => state.fixedRoutes.routes
  );

  const filteredRoutes = fixedRoutes.filter(
    (route) =>
      route.driverId === user?.id &&
      (route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderItem = (item: IFixedRoute) => (
    <Pressable
      key={item.id}
      onPress={() => router.push(`/fixed-route-detail/${item.id}`)}
    >
      <Box className="bg-white p-4 mb-2 rounded-md shadow-sm w-full">
        <Text className="font-bold">
          {item.startLocation} đến {item.endLocation}
        </Text>
        <Text>Khởi hành: {new Date(item.departureTime).toLocaleString()}</Text>
        <Text>
          Số ghế còn trống: {item.availableSeats}/{item.totalSeats}
        </Text>
        <Text>Giá: {item.price.toLocaleString()} VND</Text>
      </Box>
    </Pressable>
  );

  if (filteredRoutes.length === 0) {
    return (
      <Box className="w-full">
        <Heading size="md" className="mb-2">
          Tuyến cố định của bạn
        </Heading>
        <Text>Không tìm thấy tuyến cố định nào. Thêm một tuyến mới để bắt đầu!</Text>
        <Button
          size="sm"
          className="mt-4 bg-blue-500 w-full"
          onPress={() => router.push("/create-fixed-route")}
        >
          <ButtonText className="text-white">Thêm tuyến mới</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <Heading size="md" className="mb-2">
        Tuyến cố định của bạn
      </Heading>
      {filteredRoutes.map((item) => renderItem(item))}
      <Button
        size="sm"
        className="mt-4 bg-blue-500 w-full"
        onPress={() => router.push("/create-fixed-route")}
      >
        <ButtonText className="text-white">Thêm tuyến mới</ButtonText>
      </Button>
    </Box>
  );
}

