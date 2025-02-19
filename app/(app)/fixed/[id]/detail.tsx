const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { ButtonText } from "@/src/components/ui/button";
import { ScrollView, StyleSheet } from "react-native";
import FixedRouteItem from "@/src/components/FixedRouteItem";
import type { IFixedRoute, IUser } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { HStack } from "@/src/components/ui/hstack";
import { formatMoney } from "@/src/utils/formatMoney";
import { Divider } from "@/src/components/ui/divider";
import type { RootState } from "@/src/store/store";
import FixedRouteOrder from "@/src/components/FixedRouteOrder";
import FixedRouteRequestList from "@/src/components/FixedRouteRequestList";
import AppLoading from "@/src/components/AppLoading";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
import {
  Camera,
  MapView,
  setAccessToken,
  RasterSource,
  RasterLayer,
} from "@maplibre/maplibre-react-native";

setAccessToken(null); // MapLibre doesn't require an access token

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

export default function FixedRouteDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [fixedRoute, setFixedRoute] = useState<IFixedRoute>();

  const [isLoading, setIsLoading] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [error, setError] = useState(false);

  const [fixedRouteOrderVisible, setFixedRouteOrderVisible] = useState(false);

  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const fetch = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const { data, error } = await xediSupabase.tables.fixedRoutes.selectById(
      id
    );
    if (data?.[0] && !error) {
      setFixedRoute(data[0]);
    } else {
      setError(true);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetch();
  }, [id]); // Added isLoading to dependencies

  const onRefresh = React.useCallback(() => {
    setIsRefreshing(true);
    setTimeout(async () => {
      fetch(); // Just reverse the order for demo purposes
      setIsRefreshing(false);
    }, 2000);
  }, []);

  const isAuthor = React.useMemo(
    () => user && fixedRoute && user.id === fixedRoute.user_id,
    [user, fixedRoute]
  );

  return (
    <AppLoading isLoading={isLoading}>
      <Box className="flex-1 bg-gray-100">
        <SafeAreaView style={styles.container}>
          <ScrollView style={styles.container}>
            <Box className="flex-1 p-4 bg-gray-100">
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
                <MapView style={styles.map}>
                  <Camera
                    defaultSettings={{
                      centerCoordinate: [0, 0],
                      zoomLevel: 2,
                    }}
                  />
                  <RasterSource
                    id="openStreetMapSource"
                    tileUrlTemplates={[
                      "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                    ]}
                    minZoomLevel={0}
                    maxZoomLevel={19}
                  >
                    <RasterLayer
                      id="openStreetMapLayer"
                      sourceID="openStreetMapSource"
                    />
                  </RasterSource>
                </MapView>
                <FixedRouteRequestList
                  isRefreshing={isRefreshing}
                  fixedRoute={fixedRoute}
                  onFixedRouteOrder={() => setFixedRouteOrderVisible(true)}
                />
              </VStack>
            </Box>
          </ScrollView>
          {user?.id === fixedRoute?.user_id && (
            <HStack space="md" className="w-full bg-white p-4 rounded-sm">
              <Box className="w-[100%]">
                <Button
                  className="w-full h-[45px] bg-primary-500 rounded-md items-center justify-center"
                  size="xl"
                  onPress={() => router.push(`/fixed/${fixedRoute.id}/edit`)}
                >
                  <ButtonText>Hoàn thành</ButtonText>
                </Button>
              </Box>
            </HStack>
          )}
        </SafeAreaView>
        {user?.role === "customer" && (
          <FixedRouteOrder
            visible={fixedRouteOrderVisible}
            onClose={() => setFixedRouteOrderVisible(false)}
            user={user}
            fixedRoute={fixedRoute}
            onSuccess={onRefresh}
          />
        )}
      </Box>
    </AppLoading>
  );
}
