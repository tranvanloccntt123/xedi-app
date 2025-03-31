const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import useLocation from "@/hooks/useLocation";
import AppMapView, { AppMapViewMethods } from "../AppMapView";
import Header from "../Header";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { xediSupabase } from "@/src/lib/supabase";
import { Heading } from "../ui/heading";
import { scale } from "react-native-size-matters";
import BottomSheetGesture from "../BottomSheetGesture";
import FixedRouteRunningListCustomer from "./FixedRouteRunningListCustomer";
import { MarkerView } from "@maplibre/maplibre-react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import LocationIcon from "../icons/LocationIcon";
import { ZOOM_LEVEL, MARKER_SIZE } from "@/src/constants";

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

  const mapRef = React.useRef<AppMapViewMethods>(null);

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

  const markerResizeAnim = useSharedValue(ZOOM_LEVEL[1]);

  const markerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
      height: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
    };
  });

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
        <AppMapView
          ref={mapRef}
          onCenterChange={(_, zoomLevel) => {
            markerResizeAnim.value = zoomLevel;
          }}
        >
          <MarkerView coordinate={[lon, lat]}>
            <Animated.View style={[markerStyle, { alignItems: "center" }]}>
              <LocationIcon size={"50%"} color="#bf2c2c" />
            </Animated.View>
          </MarkerView>
        </AppMapView>
      </Box>
      <BottomSheetGesture
        isDisableFetchRemind={true}
        coordinate={{
          lat: 0,
          lon: 0,
        }}
      >
        <Box className="flex-1 px-2">
          <Heading size="xl" className="mb-2">
            Khách hàng
          </Heading>
          <FixedRouteRunningListCustomer
            fixedRoute={fixedRoute}
            onMoveTo={(coordinate) => {
              console.log("MOVE TO ", coordinate);
              mapRef.current?.moveTo(coordinate);
            }}
          />
        </Box>
      </BottomSheetGesture>
    </Box>
  );
};

export default FixedRouteDetailRunning;
