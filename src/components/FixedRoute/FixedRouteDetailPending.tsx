const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { Divider } from "@/src/components/ui/divider";
import type { RootState } from "@/src/store/store";
import FixedRouteRequestList from "@/src/components/FixedRoute/FixedRouteRequestList";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
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

const FixedRouteDetailPending: React.FC<{
  fixedRoute: IFixedRoute;
  isRefreshing: boolean;
  onRefresh: () => any;
  onRunning: () => any;
  onFinished: () => any;
}> = ({ fixedRoute, isRefreshing, onRefresh, onRunning, onFinished }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && fixedRoute && user.id === fixedRoute.user_id,
    [user, fixedRoute]
  );

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          <Box className="flex-1 px-4 bg-gray-100">
            <VStack space="md">
              <Header
                title="Chi tiết hành trình"
                rightComponent={
                  isAuthor && (
                    <Button variant="link">
                      <ButtonIcon as={EditIcon} stroke={"#000000"} />
                    </Button>
                  )
                }
              />
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
                </VStack>
              </Box>
              <FixedRouteRequestList
                isRefreshing={isRefreshing}
                fixedRoute={fixedRoute}
                onFixedRouteOrder={() =>
                  router.navigate(`/fixed/${fixedRoute.id}/customer-order`)
                }
              />
              <FixedRouteMergeList fixedRoute={fixedRoute} />
            </VStack>
          </Box>
        </ScrollView>
        {user?.id === fixedRoute?.user_id && (
          <HStack space="md" className="w-full bg-white p-4 rounded-sm">
            <Box className="flex-1">
              <Button
                className="w-full h-[45px] rounded-md items-center justify-center border-success-500"
                size="xl"
                variant="outline"
                onPress={onFinished}
              >
                <ButtonText className="text-success-500">Hoàn thành</ButtonText>
              </Button>
            </Box>
            <Box className="flex-1">
              <Button
                className="w-full h-[45px] bg-primary-500 rounded-md items-center justify-center"
                size="xl"
                onPress={onRunning}
              >
                <ButtonText>Bắt đầu</ButtonText>
              </Button>
            </Box>
          </HStack>
        )}
      </SafeAreaView>
    </Box>
  );
};

export default FixedRouteDetailPending;
