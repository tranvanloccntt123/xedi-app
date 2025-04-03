import React, { useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  Camera,
  MapView,
  setAccessToken,
  RasterSource,
  RasterLayer,
  MarkerView,
  MapViewRef,
  CameraRef,
} from "@maplibre/maplibre-react-native";
import LocationIcon from "./icons/LocationIcon";
import AppLoading from "./View/AppLoading";
import { BottomSheetContext } from "@/src/components/ui/bottom-sheet";
import { Box } from "@/src/components/ui/box";
import useDebounce from "@/hooks/useDebounce";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { ZOOM_LEVEL, MARKER_SIZE } from "../constants";
import { TouchableOpacity } from "react-native";
import { ScaledSheet } from "react-native-size-matters";

export interface AppMapViewProps {
  onPress?: (coordinate: { lat: number; lon: number }) => any;
  isOpenTrigger?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  onCenterChange?: (
    coordinate: { lat: number; lon: number },
    zoomLevel?: number
  ) => any;
  debounceCenterChange?: number;
  onRegionWillChange?: () => any;
  isHideCurrentLocation?: boolean;
}

export interface AppMapViewMethods {
  moveTo: (coordinate: { lat: number; lon: number }, duration?: number) => any;
}

setAccessToken(null);

const getTileXY = (lat, lon, zoom) => {
  const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const y = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      Math.pow(2, zoom)
  );
  return { x, y };
};

const AppMapView = React.forwardRef<AppMapViewMethods, AppMapViewProps>(
  (
    {
      onPress,
      isOpenTrigger,
      children,
      onCenterChange,
      onRegionWillChange,
      isHideCurrentLocation,
      debounceCenterChange,
    },
    ref
  ) => {
    const debounce = useDebounce({
      time: debounceCenterChange !== undefined ? debounceCenterChange : 100,
    });
    const mapViewRef = React.useRef<MapViewRef>(null);
    const cameraViewRef = React.useRef<CameraRef>(null);
    const { userLat, userLon } = useSelector((state: RootState) => ({
      userLat: state.auth.user.lat,
      userLon: state.auth.user.lon,
    }));
    const { lat: currentLocationLat, lon: currentLocationLon } = useSelector(
      (state: RootState) => state.location
    );
    const { lat, lon } = React.useMemo(
      () => ({
        lat: currentLocationLat || userLat || 21.028511,
        lon: currentLocationLon || userLon || 105.804817,
      }),
      [currentLocationLat, currentLocationLon]
    );
    const { handleOpen } = React.useContext(BottomSheetContext);

    const markerResizeAnim = useSharedValue(ZOOM_LEVEL[1]);

    const onMapPress = (event) => {
      const { geometry } = event;
      geometry.coordinates?.length &&
        onPress?.({
          lat: geometry.coordinates[1],
          lon: geometry.coordinates[0],
        });
      isOpenTrigger && handleOpen?.();
      const { x, y } = getTileXY(
        geometry.coordinates[1],
        geometry.coordinates[0],
        8
      );
    };

    const moveRef = React.useRef<any>(null);

    const markerStyle = useAnimatedStyle(() => {
      return {
        width: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
        height: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
      };
    });

    useImperativeHandle(ref, () => {
      return {
        moveTo(coordinate, duration = 200) {
          cameraViewRef.current?.moveTo(
            [coordinate.lon, coordinate.lat],
            duration
          );
          clearTimeout(moveRef.current);
          moveRef.current = setTimeout(() => {
            cameraViewRef.current?.zoomTo(ZOOM_LEVEL[1], duration + 10);
          }, 210);
        },
      };
    });

    return (
      <Box className="flex-1 w-full">
        <AppLoading isLoading={[lat, lon].includes(null)}>
          <>
            {![lat, lon].includes(null) && (
              <MapView
                style={{ flex: 1 }}
                onPress={onMapPress}
                onRegionWillChange={() => onRegionWillChange?.()}
                rotateEnabled={false}
                zoomEnabled={false}
                onRegionIsChanging={async (f) => {
                  markerResizeAnim.value = f.properties.zoomLevel;
                  if (onCenterChange) {
                    debounce(async () => {
                      const center = await mapViewRef.current.getCenter();
                      onCenterChange(
                        { lat: center[1], lon: center[0] },
                        f.properties.zoomLevel
                      );
                    });
                  }
                }}
                ref={mapViewRef}
              >
                <Camera
                  ref={cameraViewRef}
                  defaultSettings={{
                    centerCoordinate: [lon, lat],
                    zoomLevel: ZOOM_LEVEL[1],
                  }}
                />
                <RasterSource
                  id="openStreetMapSource"
                  tileUrlTemplates={[
                    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                  ]}
                  minZoomLevel={ZOOM_LEVEL[0]}
                  maxZoomLevel={ZOOM_LEVEL[1]}
                >
                  <RasterLayer
                    id="openStreetMapLayer"
                    sourceID="openStreetMapSource"
                  />
                </RasterSource>
                {!isHideCurrentLocation && (
                  <MarkerView coordinate={[lon, lat]}>
                    <Animated.View
                      style={[markerStyle, { alignItems: "center" }]}
                    >
                      <LocationIcon size={"50%"} color="#bf2c2c" />
                    </Animated.View>
                  </MarkerView>
                )}
                {children}
              </MapView>
            )}
            <TouchableOpacity></TouchableOpacity>
          </>
        </AppLoading>
      </Box>
    );
  }
);

export default AppMapView;
