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

const AppMapView: React.FC<{
  onPress?: (coordinate: { lat: number; lon: number }) => any;
  isOpenTrigger?: boolean;
  children?: React.ReactNode | React.ReactNode[];
  onCenterChange?: (coordinate: { lat: number; lon: number }) => any;
  onRegionWillChange?: () => any;
}> = ({
  onPress,
  isOpenTrigger,
  children,
  onCenterChange,
  onRegionWillChange,
}) => {
  const debounce = useDebounce({ time: 100 });
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

  const onMapPress = (event) => {
    const { geometry } = event;
    geometry.coordinates?.length &&
      onPress?.({ lat: geometry.coordinates[1], lon: geometry.coordinates[0] });
    isOpenTrigger && handleOpen?.();
    console.log(event);
    const { x, y } = getTileXY(
      geometry.coordinates[1],
      geometry.coordinates[0],
      8
    );
    console.log(x, y);
  };
  return (
    <Box className="flex-1 w-full">
      <AppLoading isLoading={[lat, lon].includes(null)}>
        {![lat, lon].includes(null) && (
          <MapView
            style={{ flex: 1 }}
            onPress={onMapPress}
            onRegionWillChange={() => onRegionWillChange?.()}
            onRegionIsChanging={async (f) => {
              if (onCenterChange) {
                debounce(async () => {
                  const center = await mapViewRef.current.getCenter();
                  onCenterChange({ lat: center[1], lon: center[0] });
                });
              }
            }}
            ref={mapViewRef}
          >
            <Camera
              defaultSettings={{
                centerCoordinate: [lon, lat],
                zoomLevel: 18,
              }}
            />
            <RasterSource
              id="openStreetMapSource"
              tileUrlTemplates={[
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ]}
              minZoomLevel={2}
              maxZoomLevel={19}
            >
              <RasterLayer
                id="openStreetMapLayer"
                sourceID="openStreetMapSource"
              />
            </RasterSource>
            <MarkerView coordinate={[lon, lat]}>
              <LocationIcon size={50} color="#bf2c2c" />
            </MarkerView>
            {children}
          </MapView>
        )}
      </AppLoading>
    </Box>
  );
};

export default AppMapView;
