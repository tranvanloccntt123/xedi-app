import React from "react";
import { MarkerView } from "@maplibre/maplibre-react-native";
import EclipseIcon from "./icons/EclipseIcon";

const EclipseMarkerIcon: React.FC<{
  coordinate: { lat: number; lon: number };
}> = ({ coordinate }) => {
  return (
    !!coordinate?.lat &&
    !!coordinate?.lon && (
      <MarkerView coordinate={[coordinate.lon, coordinate.lat]}>
        <EclipseIcon size={18} color="#000000" />
      </MarkerView>
    )
  );
};

export default EclipseMarkerIcon;
