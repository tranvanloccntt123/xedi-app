const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { ScrollView, StyleSheet } from "react-native";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import type { IFixedRoute } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { Divider } from "@/src/components/ui/divider";
import Header from "@/src/components/Header";
import FixedRouteRequestList from "./FixedRouteRequestList";
import FixedRouteMergeList from "./FixedRouteMergeList";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 500,
  },
});

const FixedRouteDetailFinished: React.FC<{
  fixedRoute: IFixedRoute;
}> = ({ fixedRoute }) => {
  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Box className="flex-1 px-4 bg-gray-100">
            <VStack space="md">
              <Header title="Chi tiết hành trình" />
              {!!fixedRoute && (
                <FixedRouteItem
                  className="mx-0"
                  fixedRoute={fixedRoute}
                  disabled
                  isHiddenPrice
                />
              )}
              <Box className="p-4 bg-white rounded-md mb-4">
                <VStack space="md">
                  <Heading size="md">Thanh toán</Heading>
                  <HStack space="md">
                    <Text className="flex-1">Cước phí</Text>
                    <Text className="flex-1 text-right text-lg font-[600] text-black">
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Heading size="sm" className="flex-1">
                      Trả qua tiền mặt
                    </Heading>
                    <Text className="flex-1 text-right text-lg font-[600] text-black">
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack space="md">
                    <Text className="flex-1">Trạng thái</Text>
                    <Text className="flex-1 text-right text-lg font-[600] text-success-500">
                      Hoàn thành
                    </Text>
                  </HStack>
                </VStack>
              </Box>
              <FixedRouteRequestList fixedRoute={fixedRoute} />
              <FixedRouteMergeList fixedRoute={fixedRoute} />
            </VStack>
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
};

export default FixedRouteDetailFinished;
