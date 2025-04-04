import useLocation from "@/hooks/useLocation";
import { Box } from "@/src/components/ui/box";
import React from "react";
import AppMapView from "@/src/components/AppMapView";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import Header from "@/src/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import EclipseMarkerIcon from "@/src/components/EclipseMarkerIcon";
import { Center } from "@/src/components/ui/center";
import PinMarkerIcon from "@/src/components/PrinMarkerIcon";
import BottomSheetGesture from "@/src/components/BottomSheetGesture";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { StatusBar } from "react-native";

export default function AddLocation() {
  useLocation({ isWatchLocation: true });

  const { lat, lon } = useSelector((state: RootState) => state.location);

  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>({
    lat: lat,
    lon: lon,
  });

  return (
    <BottomSheet>
      <Box className="flex-1">
        <StatusBar translucent backgroundColor={"transparent"} />
        <SafeAreaView style={{ flex: 1 }}>
          <Box className="px-4">
            <Header title="Thêm điểm đón" />
          </Box>
          <Center className="flex-1">
            <AppMapView onCenterChange={(c) => setCoordinate(c)}>
              <EclipseMarkerIcon coordinate={coordinate} />
            </AppMapView>
            <PinMarkerIcon />
          </Center>
        </SafeAreaView>
        <BottomSheetGesture coordinate={coordinate} />
      </Box>
    </BottomSheet>
  );
}
