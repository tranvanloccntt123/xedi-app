import useLocation from "@/hooks/useLocation";
import { Box } from "@/src/components/ui/box";
import React from "react";
import AppMapView from "@/src/components/AppMapView";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import ReverseLocationBottomSheet from "@/src/components/Location/ReverseLocationBottomSheet";
import Header from "@/src/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import EclipseMarkerIcon from "@/src/components/EclipseMarkerIcon";
import { Center } from "@/src/components/ui/center";
import PinMarkerIcon from "@/src/components/PrinMarkerIcon";
import BottomSheetGesture from "@/src/components/BottomSheetGesture";

export default function AddLocation() {
  useLocation({ isWatchLocation: true });

  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>();

  return (
    <BottomSheet>
      <Box className="flex-1">
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
