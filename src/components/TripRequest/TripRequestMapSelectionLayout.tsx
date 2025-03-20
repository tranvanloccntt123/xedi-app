import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";
import AppMapView from "@/src/components/AppMapView";
import useLocation from "@/hooks/useLocation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { SelectLocationType } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { setTripRequestLocation } from "@/src/store/postForm/postFormSlice";
import CreatePostPolyline from "@/src/components/Feed/CreatePostPolyline";
import CreateTripBottomSheet from "@/src/components/TripRequest/CreateTripBottomSheet";
import Animated from "react-native-reanimated";
import PinIcon from "@/src/components/icons/PinIcon";
import { StyleSheet } from "react-native";
import { Center } from "@/src/components/ui/center";
import { MarkerView } from "@maplibre/maplibre-react-native";
import EclipseIcon from "@/src/components/icons/EclipseIcon";

const TripRequestMapSelectionLayout: React.FC<{
  onConfirm?: () => any;
  isShareHide?: boolean;
}> = ({ onConfirm, isShareHide }) => {
  useLocation({ isWatchLocation: true });
  const { type } = useLocalSearchParams<{ type: SelectLocationType }>();
  const { lat, lon } = useSelector((state: RootState) => state.location);
  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>({
    lat: lat,
    lon: lon,
  });

  const dispatch = useDispatch();

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header title="Tạo tuyến đường" />
        </Box>
        <Center className="flex-1 w-full">
          <AppMapView
            onCenterChange={(location) => {
              console.log(location);
              setCoordinate(location);
            }}
          >
            <CreatePostPolyline />
            {!!coordinate?.lat && !!coordinate?.lon && (
              <MarkerView coordinate={[coordinate.lon, coordinate.lat]}>
                <EclipseIcon size={18} color="#000000" />
              </MarkerView>
            )}
          </AppMapView>
          <Animated.View style={[styles.pinContainer]}>
            <Box style={{ top: -18 }}>
              <PinIcon size={34} color="#000000" />
            </Box>
          </Animated.View>
        </Center>
      </SafeAreaView>
      <CreateTripBottomSheet
        onConfirm={onConfirm}
        isShareHide={isShareHide}
        coordinate={coordinate}
        onPress={(location) => dispatch(setTripRequestLocation(location))}
      />
    </Box>
  );
};

const styles = StyleSheet.create({
  pinContainer: {
    position: "absolute",
  },
});

export default TripRequestMapSelectionLayout;
