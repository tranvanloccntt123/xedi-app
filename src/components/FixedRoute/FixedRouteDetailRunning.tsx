const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { StyleSheet } from "react-native";
import type { IFixedRoute, IUser } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import useLocation from "@/hooks/useLocation";
import AppMapView from "../AppMapView";
import Header from "../Header";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

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

const FixedRouteDetailRunning: React.FC<{
  fixedRoute: IFixedRoute;
  onFinished: () => any;
}> = ({ fixedRoute, onFinished }) => {
  useLocation({ isWatchLocation: true });
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && fixedRoute && user.id === fixedRoute.user_id,
    [user, fixedRoute]
  );

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={styles.container}>
        <Box className="px-4">
          <Header
            title="Hành trình"
            rightComponent={
              isAuthor && (
                <Button
                  onPress={onFinished}
                  // disabled={!!listFixedRouteRequest.length}
                  className={`rounded-full`}
                >
                  <Text className="text-white">Hoàn thành</Text>
                </Button>
              )
            }
          />
        </Box>
        <AppMapView />
      </SafeAreaView>
    </Box>
  );
};

export default FixedRouteDetailRunning;
