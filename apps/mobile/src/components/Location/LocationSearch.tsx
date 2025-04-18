"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Box } from "@/src/components/ui/box";
import { Input } from "@/src/components/ui/input";
import { InputField } from "@/src/components/ui/input";
import { VStack } from "@/src/components/ui/vstack";
import { Text } from "@/src/components/ui/text";
import { Pressable } from "@/src/components/ui/pressable";
import useDebounce from "@/hooks/useDebounce";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import HiIcon from "../icons/HiIcon";
import LocationIcon from "../icons/LocationIcon";
import SwapIcon from "../icons/SwapIcon";
import CloseIcon from "../icons/CloseIcon";
import { Button, ButtonText } from "../ui/button";
import { router } from "expo-router";
import { HStack } from "../ui/hstack";
import ShareIcon from "../icons/ShareIcon";
import AppColors from "@/src/constants/colors";
import { wrapTextStyle } from "@/src/theme/AppStyles";

interface LocationSearchProps {
  defaultLocation?: InputLocation;
  onConfirm?: () => any;
  isShareHide?: boolean;
  inputSelectionType: SelectLocationType;
  startLocation: InputLocation;
  endLocation: InputLocation;
  departureTime: Date;
  onSwap?: () => any;
  onClearStartLocation?: () => any;
  onClearEndLocation?: () => any;
  onSelectLocation?: (data: InputLocation) => any;
  onStartLocationFocus?: () => any;
  onEndLocationFocus?: () => any;
}

const BORDER_RADIUS = 16;

export default function LocationSearch({
  defaultLocation,
  onConfirm,
  isShareHide,
  inputSelectionType,
  startLocation,
  endLocation,
  onSelectLocation,
  onSwap,
  onClearStartLocation,
  onClearEndLocation,
  onStartLocationFocus,
  onEndLocationFocus,
}: LocationSearchProps) {
  // Initialize query with default location if it exists
  const [queryStartLocation, setQueryStartLocation] = useState(
    defaultLocation?.display_name || ""
  );
  const [queryEndLocation, setQueryEndLocation] = useState(
    defaultLocation?.display_name || ""
  );
  const [resultStartLocation, setResultStartLocation] = useState<
    InputLocation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const startLocationAnim = useSharedValue(0);

  const endLocationAnim = useSharedValue(0);

  const startLocationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        startLocationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
      ),
      borderColor: interpolateColor(
        startLocationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", AppColors.primary]
      ),
    };
  });

  const endLocationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        endLocationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
      ),
      borderColor: interpolateColor(
        endLocationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", AppColors.primary]
      ),
    };
  });

  const debounce = useDebounce({ time: 500 });

  // const debounceSendEvent = useDebounce({ time: 100 });

  const startLocationRef = React.useRef<TextInput>(null);

  const endLocationRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    debounce(async () => {
      const query =
        startLocationAnim.value === 1 ? queryStartLocation : queryEndLocation;
      if (
        resultStartLocation.find((location) => location.display_name === query)
      ) {
        setResultStartLocation([]);
        return;
      }
      if (
        (queryStartLocation.length > 2 && startLocationAnim.value === 1) ||
        (queryEndLocation.length > 2 && endLocationAnim.value === 1)
      ) {
        setIsLoading(true);

        try {
          const response = await fetch(
            `https://photon.komoot.io/api?q=${encodeURIComponent(
              `${query}, Việt Nam`
            )}`
          );
          const data = await response.json();
          setResultStartLocation(
            data.features
              .map((v) => ({
                display_name: [
                  v?.properties?.name,
                  v?.properties?.street,
                  v?.properties?.locality,
                  v?.properties?.district,
                  v?.properties?.city,
                  v?.properties?.country,
                ]
                  .filter((v) => !!v)
                  .join(", "),
                lat: v.geometry.coordinates[1],
                lon: v.geometry.coordinates[0],
              }))
              .filter((v, i) => i < 5)
          );
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResultStartLocation([]);
      }
    });
  }, [queryStartLocation, queryEndLocation]);

  useEffect(() => {
    setQueryStartLocation(startLocation?.display_name || "");
  }, [startLocation]);

  useEffect(() => {
    setQueryEndLocation(endLocation?.display_name || "");
  }, [endLocation]);

  useEffect(() => {
    if (inputSelectionType === "end-location") {
      endLocationRef.current.focus();
    } else {
      startLocationRef.current.focus();
    }
  }, [inputSelectionType]);

  const handlerSwap = onSwap;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjusts based on platform
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20} // Optional offset tweak
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <HStack space="md" className="items-center">
          <Box
            className="bg-xedi-primary/[.08] flex-1"
            style={{ borderRadius: BORDER_RADIUS }}
          >
            <Animated.View style={[styles.inputContainer, startLocationStyle]}>
              <Input className="h-[55px] border-0 px-2">
                <HiIcon size={24} color={AppColors.black} />
                <InputField
                  ref={startLocationRef as never}
                  placeholder="Điểm đón"
                  value={queryStartLocation}
                  onChangeText={setQueryStartLocation}
                  onFocus={() => {
                    startLocationAnim.value = withTiming(1, { duration: 50 });
                    onStartLocationFocus?.();
                  }}
                  style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                  onBlur={() =>
                    (startLocationAnim.value = withTiming(0, { duration: 50 }))
                  }
                />
                <Box className="w-[55px] items-end">
                  {!!queryStartLocation && (
                    <Pressable
                      onPress={() => {
                        setQueryStartLocation("");
                        onClearStartLocation?.();
                      }}
                    >
                      <CloseIcon size={24} color={AppColors.black} />
                    </Pressable>
                  )}
                </Box>
              </Input>
            </Animated.View>
            <Animated.View style={[styles.inputContainer, endLocationStyle]}>
              <Input className="h-[55px] border-0 px-2">
                <LocationIcon size={24} color={AppColors.warning} />
                <InputField
                  ref={endLocationRef as never}
                  placeholder="Điểm đến"
                  value={queryEndLocation}
                  onChangeText={setQueryEndLocation}
                  onFocus={() => {
                    endLocationAnim.value = withTiming(1, { duration: 50 });
                    onEndLocationFocus?.();
                  }}
                  style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                  onBlur={() =>
                    (endLocationAnim.value = withTiming(0, { duration: 50 }))
                  }
                />
                <Box className="w-[55px] items-end">
                  {!!queryEndLocation && (
                    <Pressable
                      onPress={() => {
                        setQueryEndLocation("");
                        onClearEndLocation?.();
                      }}
                    >
                      <CloseIcon size={24} color="#000000" />
                    </Pressable>
                  )}
                </Box>
              </Input>
            </Animated.View>
          </Box>
          <Box className="bg-white h-[40px] w-[40px] justify-center items-center rounded-full z-[2]">
            <Pressable onPress={handlerSwap} style={styles.swapBtn}>
              <SwapIcon size={24} color="#000000" />
            </Pressable>
          </Box>
        </HStack>
        {!!startLocation && !!endLocation && (
          <HStack space="md" className="w-full">
            <Box className="flex-1">
              <Button onPress={onConfirm} className="mt-4 h-[45px]">
                <ButtonText>Xác nhận</ButtonText>
              </Button>
            </Box>
            {!isShareHide && (
              <Box>
                <Button
                  onPress={() => router.navigate(`/post/create`)}
                  className="mt-4 h-[45px]"
                  variant="outline"
                >
                  <ShareIcon color="#000000" size={24} />
                  <ButtonText className="text-black">Chia sẻ</ButtonText>
                </Button>
              </Box>
            )}
          </HStack>
        )}
        {isLoading && <ActivityIndicator style={{ marginTop: 10 }} />}
        <VStack space="sm" className="mt-2">
          {resultStartLocation.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => {
                onSelectLocation(item);
              }}
              className="p-2 bg-white rounded-md"
            >
              <Text>{item.display_name}</Text>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    borderRadius: BORDER_RADIUS,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
  },
  swapBtn: {},
});
