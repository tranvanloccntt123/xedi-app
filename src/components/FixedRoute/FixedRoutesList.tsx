import React, { useCallback } from "react";
import { FlatList } from "react-native";
import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import type { IFixedRoute } from "@/src/types";
import FixedRouteItem from "./FixedRouteItem";
import moment from "moment";
import { Heading } from "@/src/components/ui/heading";
import LottieView from "lottie-react-native";
import Lottie from "@/src/lottie";

const APP_STRUCT = "FIXED_ROUTES_LIST";

interface FixedRoutesListProps {
  searchQuery: string;
}

export default function FixedRoutesList({ searchQuery }: FixedRoutesListProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const fixedRoutes = useSelector(
    (state: RootState) => state.fixedRoutes.routes
  );

  const filteredRoutes = fixedRoutes.filter(
    (route: IFixedRoute) =>
      route.user_id === user?.id &&
      (route.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.endLocation.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderItem = useCallback(
    ({ item, index }: { item: IFixedRoute; index: number }) => {
      const month = moment(item.departureTime).format("MM/YYYY");
      const upMonth =
        index &&
        moment(filteredRoutes[index - 1].departureTime).format("MM/YYYY");
      return (
        <Box className="px-4 mb-[15px] w-full">
          {(index === 0 || month !== upMonth) && (
            <Heading size="xs" className="mb-2 text-bold text-primary-600">
              Tháng {month}
            </Heading>
          )}
          <FixedRouteItem fixedRoute={item} />
        </Box>
      );
    },
    [filteredRoutes]
  );

  return (
    <Box className="w-full">
      <FlatList
        data={filteredRoutes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Box className="w-full px-4">
            <LottieView
              source={Lottie.CAR}
              colorFilters={[]}
              style={{ width: "100%", height: 200 }}
              autoPlay
              loop
            />
            <Text className="text-center font-bold">
              Không tìm thấy tuyến cố định nào. Thêm một tuyến mới để bắt đầu!
            </Text>
          </Box>
        )}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </Box>
  );
}

