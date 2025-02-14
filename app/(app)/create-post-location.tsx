import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setStartLocation, setEndLocation } from "@/src/store/postSlice";
import LocationSearch from "@/src/components/LocationSearch";
import { Box } from "@/src/components/ui/box";
import type { InputLocation } from "@/src/types";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { Platform, ScrollView } from "react-native";

export default function CreatePostLocation() {
  const { type } = useLocalSearchParams<{
    type: "startLocation" | "endLocation";
  }>();
  const router = useRouter();
  const dispatch = useDispatch();

  // Get current locations from postSlice
  const { startLocation, endLocation } = useSelector(
    (state: RootState) => state.post
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

  return (
    <Box className="flex-1 bg-white">
      <SafeAreaView style={{ flex: 1 }}>
        <Box className="p-4">
          <Header
            title={
              type === "startLocation" ? "Chọn điểm bắt đầu" : "Chọn điểm đến"
            }
          />
        </Box>
        <ScrollView showsVerticalScrollIndicator={Platform.OS === "web"}>
          <Box className="px-4">
            <LocationSearch
              onSelectLocation={handleLocationSelect}
              defaultLocation={defaultLocation}
            />
          </Box>
        </ScrollView>
      </SafeAreaView>
    </Box>
  );
}
