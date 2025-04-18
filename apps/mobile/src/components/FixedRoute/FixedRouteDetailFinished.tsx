const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { ScrollView, StyleSheet } from "react-native";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { Divider } from "@/src/components/ui/divider";
import Header from "@/src/components/Header";
import FixedRouteRequestList from "./FixedRouteRequestList";
import FixedRouteMergeList from "./FixedRouteMergeList";
import { wrapTextStyle } from "@/src/theme/AppStyles";

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
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container} bounces={false}>
          <Box className="flex-1 px-4">
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
              <Box className="p-4 bg-xedi-card rounded-md mb-4">
                <VStack space="md">
                  <Text style={wrapTextStyle({ fontWeight: "900" }, "sm")}>
                    Thanh toán
                  </Text>
                  <HStack space="md">
                    <Text
                      className="flex-1 color-xedi-placeholder"
                      style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
                    >
                      Cước phí
                    </Text>
                    <Text
                      className="flex-1 text-right"
                      style={wrapTextStyle({ fontWeight: "700" }, "2xs")}
                    >
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack>
                    <Text
                      className="flex-1 color-xedi-placeholder"
                      style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
                    >
                      Trả qua tiền mặt
                    </Text>
                    <Text
                      className="flex-1 text-right"
                      style={wrapTextStyle({ fontWeight: "700" }, "2xs")}
                    >
                      {formatMoney(fixedRoute?.price?.toString() || "")} (VND)
                    </Text>
                  </HStack>
                  <Divider />
                  <HStack space="md">
                    <Text
                      className="flex-1 color-xedi-placeholder"
                      style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
                    >
                      Trạng thái
                    </Text>
                    <Text
                      className="flex-1 text-right color-xedi-success"
                      style={wrapTextStyle({ fontWeight: "600" }, "2xs")}
                    >
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
