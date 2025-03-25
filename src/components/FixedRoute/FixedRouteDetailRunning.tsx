const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { StyleSheet } from "react-native";
import type { IFixedRoute, IUser } from "@/src/types";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import useLocation from "@/hooks/useLocation";
import AppMapView from "../AppMapView";
import Header from "../Header";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { xediSupabase } from "@/src/lib/supabase";
import { Heading } from "../ui/heading";
import { scale } from "react-native-size-matters";
import BottomSheetGesture from "../BottomSheetGesture";

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
  const insets = useSafeAreaInsets();
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const { lat, lon } = useSelector((state: RootState) => state.location);

  const requesting = React.useRef(false);

  const syncLocation = async () => {
    if (requesting.current) return;
    requesting.current = true;
    try {
      await xediSupabase.tables.users.updateByUserId({ lat, lon });
    } catch (e) {}
    requesting.current = false;
  };

  React.useEffect(() => {
    if (lat && lon) {
      syncLocation();
    }
  }, [lat, lon]);

  const isAuthor = React.useMemo(
    () => user && fixedRoute && user.id === fixedRoute.user_id,
    [user, fixedRoute]
  );

  return (
    <Box className="flex-1 bg-gray-100">
      <Box className="px-4 bg-white" style={{ paddingTop: insets.top }}>
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
      <Box className="flex-1">
        <AppMapView />
      </Box>
      <BottomSheetGesture
        isDisableFetchRemind={true}
        coordinate={{
          lat: 0,
          lon: 0,
        }}
      >
        <Box className="flex-1 px-2">
          <Heading>Khách hàng</Heading>
        </Box>
      </BottomSheetGesture>
    </Box>
  );
};

export default FixedRouteDetailRunning;
