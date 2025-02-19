import useLocation from "@/hooks/useLocation";
import { Box } from "@/src/components/ui/box";
import React from "react";
import AppMapView from "@/src/components/AppMapView";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import ReverseLocationBottomSheet from "@/src/components/ReverseLocationBottomSheet";

export default function AddLocation() {
  useLocation({ isWatchLocation: true });

  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>();

  console.log(coordinate);

  return (
    <BottomSheet>
      <Box className="flex-1">
        <AppMapView isOpenTrigger={true} onPress={(c) => setCoordinate(c)} />
        <ReverseLocationBottomSheet coordinate={coordinate} />
      </Box>
    </BottomSheet>
  );
}
