import React from "react";
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

const MARKER_SIZE = [10, 50];

const ZOOM_LEVEL = [8, 18];

const AppMapView: React.FC<{
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
}> = ({
  onPress,
  isOpenTrigger,
  children,
  onCenterChange,
  onRegionWillChange,
  isHideCurrentLocation,
  debounceCenterChange,
}) => {
  const debounce = useDebounce({
    time: debounceCenterChange !== undefined ? debounceCenterChange : 100,
  });
  const mapViewRef = React.useRef<MapViewRef>(null);
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

  const markerResizeAnim = useSharedValue(18);

  const onMapPress = (event) => {
    const { geometry } = event;
    geometry.coordinates?.length &&
      onPress?.({ lat: geometry.coordinates[1], lon: geometry.coordinates[0] });
    isOpenTrigger && handleOpen?.();
    const { x, y } = getTileXY(
      geometry.coordinates[1],
      geometry.coordinates[0],
      8
    );
  };

  const markerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
      height: interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE),
      transform: [
        {
          translateY:
            -interpolate(markerResizeAnim.value, ZOOM_LEVEL, MARKER_SIZE) / 2,
        },
      ],
    };
  });

  return (
    <Box className="flex-1 w-full">
      <AppLoading isLoading={[lat, lon].includes(null)}>
        {![lat, lon].includes(null) && (
          <MapView
            style={{ flex: 1 }}
            onPress={onMapPress}
            onRegionWillChange={() => onRegionWillChange?.()}
            rotateEnabled={false}
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
                <Animated.View style={[markerStyle]}>
                  <LocationIcon size={"100%"} color="#bf2c2c" />
                </Animated.View>
              </MarkerView>
            )}
            {children}
          </MapView>
        )}
      </AppLoading>
    </Box>
  );
};

export default AppMapView;
