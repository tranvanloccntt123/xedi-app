import useLocation from "@/hooks/useLocation";
import { Box } from "@/src/components/ui/box";
import React from "react";
import AppMapView from "@/src/components/AppMapView";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import ReverseLocationBottomSheet from "@/src/components/Location/ReverseLocationBottomSheet";
import Header from "@/src/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

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
          <AppMapView isOpenTrigger={true} onPress={(c) => setCoordinate(c)} />
        </SafeAreaView>
        <ReverseLocationBottomSheet coordinate={coordinate} />
      </Box>
    </BottomSheet>
  );
}
