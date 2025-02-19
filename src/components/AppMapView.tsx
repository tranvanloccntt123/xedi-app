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
} from "@maplibre/maplibre-react-native";
import LocationIcon from "./icons/LocationIcon";
import AppLoading from "./AppLoading";
import { BottomSheetContext } from "./ui/bottom-sheet";

setAccessToken(null);

const AppMapView: React.FC<{
  onPress?: (coordinate: { lat: number; lon: number }) => any;
  isOpenTrigger?: boolean;
}> = ({ onPress, isOpenTrigger }) => {
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const { handleOpen } = React.useContext(BottomSheetContext);

  const onMapPress = (event) => {
    const { geometry } = event;
    console.log(geometry);
    geometry.coordinates?.length && onPress?.({ lat: geometry.coordinates[1], lon: geometry.coordinates[0] });
    isOpenTrigger && handleOpen?.();
  };
  return (
    <AppLoading isLoading={[lat, lon].includes(null)}>
      {![lat, lon].includes(null) && (
        <MapView style={{ flex: 1 }} onPress={onMapPress}>
          <Camera
            defaultSettings={{
              centerCoordinate: [lon, lat],
              zoomLevel: 15,
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
        </MapView>
      )}
    </AppLoading>
  );
};

export default AppMapView;
