import React from "react";
import { Box } from "@/src/components/ui/box";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/src/components/Header";
import AppMapView from "@/src/components/AppMapView";
import useLocation from "@/hooks/useLocation";
import { Button } from "@/src/components/ui/button";
import SearchIcon from "@/src/components/icons/SearchIcon";
import { BottomSheetContext } from "@/src/components/ui/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { InputLocation, SelectLocationType } from "@/src/types";
import { useLocalSearchParams } from "expo-router";
import { resetPost, setTripRequestLocation } from "@/src/store/post/postFormSlice";
import CreatePostPolyline from "@/src/components/Feed/CreatePostPolyline";
import CreateTripBottomSheet from "@/src/components/TripRequest/CreateTripBottomSheet";
import Animated from "react-native-reanimated";
import PinIcon from "@/src/components/icons/PinIcon";
import { BackHandler, StyleSheet } from "react-native";
import { Center } from "@/src/components/ui/center";
import { MarkerView } from "@maplibre/maplibre-react-native";
import EclipseIcon from "@/src/components/icons/EclipseIcon";

const SearchButton: React.FC<object> = () => {
  const { handleOpen } = React.useContext(BottomSheetContext);

  React.useEffect(() => {
    setTimeout(() => {
      handleOpen?.();
    }, 500);
  }, []);

  return (
    <Button onPress={handleOpen} variant="link" className="mr-4">
      <SearchIcon size={24} color="#000000" />
    </Button>
  );
};

const TripRequestBottomSheet: React.FC<{
  coordinate: {
    lat: number;
    lon: number;
  };
}> = ({ coordinate }) => {
  const dispatch = useDispatch();

  const handlerSelectLocation = (location: InputLocation) => {
    dispatch(setTripRequestLocation(location));
  };

  return (
    <CreateTripBottomSheet
      coordinate={coordinate}
      onPress={handlerSelectLocation}
    />
  );
};

export default function CreateTripRequestOnly() {
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

  React.useEffect(() => {
    // Reset the post slice when the component mounts
    dispatch(resetPost({ inputSelectionType: type }));
  }, [dispatch]);

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="px-4">
          <Header title="Tạo tuyến đường" rightComponent={<SearchButton />} />
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
      <TripRequestBottomSheet coordinate={coordinate} />
    </Box>
  );
}

const styles = StyleSheet.create({
  pinContainer: {
    position: "absolute",
  },
});
