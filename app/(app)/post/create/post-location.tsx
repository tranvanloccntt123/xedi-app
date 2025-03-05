import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setStartLocation, setEndLocation } from "@/src/store/postFormSlice";
import LocationSearch from "@/src/components/Location/LocationSearch";
import { Box } from "@/src/components/ui/box";
import type { InputLocation } from "@/src/types";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { Platform, ScrollView } from "react-native";
import AppMapView from "@/src/components/AppMapView";
import useLocation from "@/hooks/useLocation";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import ReverseLocationBottomSheet from "@/src/components/Location/ReverseLocationBottomSheet";
import { splitLocation } from "@/src/utils";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Divider } from "@/src/components/ui/divider";
import { Button, ButtonText } from "@/src/components/ui/button";

export default function CreatePostLocation() {
  useLocation({ isWatchLocation: true });
  const { type } = useLocalSearchParams<{
    type: "startLocation" | "endLocation";
  }>();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get current locations from postSlice
  const { startLocation, endLocation } = useSelector(
    (state: RootState) => state.postForm
  );

  // Determine which location to show as default
  const defaultLocation =
    type === "startLocation" ? startLocation : endLocation;

  const handleLocationSelect = (location: InputLocation) => {
    if (type === "startLocation") {
      dispatch(setStartLocation(location));
    } else if (type === "endLocation") {
      dispatch(setEndLocation(location));
    }
    router.back();
  };

  const [entryLocation, setEntryLocation] = React.useState<InputLocation>();

  const [coordinate, setCoordinate] = React.useState<{
    lat: number;
    lon: number;
  }>();

  const { title, subTitle } = React.useMemo(
    () =>
      splitLocation(
        entryLocation?.display_name || defaultLocation?.display_name || ""
      ),
    [entryLocation]
  );

  const disableConfirm = React.useMemo(
    () =>
      !entryLocation ||
      entryLocation.display_name === defaultLocation?.display_name,
    [entryLocation, defaultLocation]
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-white">
        <SafeAreaView style={{ flex: 1 }}>
          <Box className="px-4">
            <Header
              title={
                type === "startLocation" ? "Chọn điểm đón" : "Chọn điểm đến"
              }
            />
          </Box>
          <AppMapView onPress={(c) => setCoordinate(c)} />
          {/* <Box className="shadow-sm absolute z-index-9 bg-white top-[120px] left-[16px] right-[16px] rounded-[22px] p-[18px]">
          <LocationSearch
            onSelectLocation={handleLocationSelect}
            defaultLocation={defaultLocation}
          />
        </Box> */}
          {!!title && (
            <Box className="shadow-sm absolute z-index-9 bg-white bottom-[40px] left-[16px] right-[16px] rounded-[22px] p-[18px]">
              <VStack space="sm">
                <Text className="font-bold text-black text-lg w-full">
                  {title}
                </Text>
                {!!subTitle && (
                  <>
                    <Divider />
                    <Text className="text-md text-gray-500 w-full">
                      {subTitle}
                    </Text>
                  </>
                )}
                <Button
                  disabled={disableConfirm}
                  className={`h-[45px] mt-4 ${disableConfirm && 'opacity-[50%]'}`}
                  onPress={() => handleLocationSelect(entryLocation)}
                >
                  <ButtonText>Xác nhận</ButtonText>
                </Button>
              </VStack>
            </Box>
          )}
        </SafeAreaView>
      </Box>
      <ReverseLocationBottomSheet
        coordinate={coordinate}
        onCoordinateChange={(location) => setEntryLocation(location)}
        isDisableBottomSheet
      />
    </BottomSheet>
  );
}
