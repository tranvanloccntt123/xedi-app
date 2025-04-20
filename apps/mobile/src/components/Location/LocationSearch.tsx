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
  start_location: InputLocation;
  end_location: InputLocation;
  departure_time: Date;
  onSwap?: () => any;
  onClearstart_location?: () => any;
  onClearend_location?: () => any;
  onSelectLocation?: (data: InputLocation) => any;
  onstart_locationFocus?: () => any;
  onend_locationFocus?: () => any;
}

const BORDER_RADIUS = 16;

export default function LocationSearch({
  defaultLocation,
  onConfirm,
  isShareHide,
  inputSelectionType,
  start_location,
  end_location,
  onSelectLocation,
  onSwap,
  onClearstart_location,
  onClearend_location,
  onstart_locationFocus,
  onend_locationFocus,
}: LocationSearchProps) {
  // Initialize query with default location if it exists
  const [querystart_location, setQuerystart_location] = useState(
    defaultLocation?.display_name || ""
  );
  const [queryend_location, setQueryend_location] = useState(
    defaultLocation?.display_name || ""
  );
  const [resultstart_location, setResultstart_location] = useState<
    InputLocation[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const start_locationAnim = useSharedValue(0);

  const end_locationAnim = useSharedValue(0);

  const start_locationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        start_locationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
      ),
      borderColor: interpolateColor(
        start_locationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", AppColors.primary]
      ),
    };
  });

  const end_locationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        end_locationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
      ),
      borderColor: interpolateColor(
        end_locationAnim.value,
        [0, 1],
        ["rgba(255, 255, 255, 0)", AppColors.primary]
      ),
    };
  });

  const debounce = useDebounce({ time: 500 });

  // const debounceSendEvent = useDebounce({ time: 100 });

  const start_locationRef = React.useRef<TextInput>(null);

  const end_locationRef = React.useRef<TextInput>(null);

  React.useEffect(() => {
    debounce(async () => {
      const query =
        start_locationAnim.value === 1 ? querystart_location : queryend_location;
      if (
        resultstart_location.find((location) => location.display_name === query)
      ) {
        setResultstart_location([]);
        return;
      }
      if (
        (querystart_location.length > 2 && start_locationAnim.value === 1) ||
        (queryend_location.length > 2 && end_locationAnim.value === 1)
      ) {
        setIsLoading(true);

        try {
          const response = await fetch(
            `https://photon.komoot.io/api?q=${encodeURIComponent(
              `${query}, Việt Nam`
            )}`
          );
          const data = await response.json();
          setResultstart_location(
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
        setResultstart_location([]);
      }
    });
  }, [querystart_location, queryend_location]);

  useEffect(() => {
    setQuerystart_location(start_location?.display_name || "");
  }, [start_location]);

  useEffect(() => {
    setQueryend_location(end_location?.display_name || "");
  }, [end_location]);

  useEffect(() => {
    if (inputSelectionType === "end-location") {
      end_locationRef.current.focus();
    } else {
      start_locationRef.current.focus();
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
            <Animated.View style={[styles.inputContainer, start_locationStyle]}>
              <Input className="h-[55px] border-0 px-2">
                <HiIcon size={24} color={AppColors.black} />
                <InputField
                  ref={start_locationRef as never}
                  placeholder="Điểm đón"
                  value={querystart_location}
                  onChangeText={setQuerystart_location}
                  onFocus={() => {
                    start_locationAnim.value = withTiming(1, { duration: 50 });
                    onstart_locationFocus?.();
                  }}
                  style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                  onBlur={() =>
                    (start_locationAnim.value = withTiming(0, { duration: 50 }))
                  }
                />
                <Box className="w-[55px] items-end">
                  {!!querystart_location && (
                    <Pressable
                      onPress={() => {
                        setQuerystart_location("");
                        onClearstart_location?.();
                      }}
                    >
                      <CloseIcon size={24} color={AppColors.black} />
                    </Pressable>
                  )}
                </Box>
              </Input>
            </Animated.View>
            <Animated.View style={[styles.inputContainer, end_locationStyle]}>
              <Input className="h-[55px] border-0 px-2">
                <LocationIcon size={24} color={AppColors.warning} />
                <InputField
                  ref={end_locationRef as never}
                  placeholder="Điểm đến"
                  value={queryend_location}
                  onChangeText={setQueryend_location}
                  onFocus={() => {
                    end_locationAnim.value = withTiming(1, { duration: 50 });
                    onend_locationFocus?.();
                  }}
                  style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
                  onBlur={() =>
                    (end_locationAnim.value = withTiming(0, { duration: 50 }))
                  }
                />
                <Box className="w-[55px] items-end">
                  {!!queryend_location && (
                    <Pressable
                      onPress={() => {
                        setQueryend_location("");
                        onClearend_location?.();
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
        {!!start_location && !!end_location && (
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
          {resultstart_location.map((item, index) => (
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
