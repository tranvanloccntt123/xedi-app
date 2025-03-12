import React from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  runOnJS,
  useAnimatedKeyboard,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Box } from "../ui/box";
import LocationSearchTripRequest from "../Location/LocationSearchTripRequest";
import { InputLocation } from "../../types";
import useReverseLocation from "@/hooks/useReverseLocation";
import { VStack } from "../ui/vstack";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { Divider } from "../ui/divider";
import { router } from "expo-router";

const CreateTripBottomSheet: React.FC<{
  coordinate: {
    lat: number;
    lon: number;
  };
  onCoordinateChange?: (_: InputLocation) => any;
  onPress?: (_: InputLocation) => any;
  onConfirm?: () => any;
  isShareHide?: boolean;
}> = ({ coordinate, onCoordinateChange, onPress, onConfirm, isShareHide }) => {
  const { setCoordinate, firstLoadData, data, title, subTitle, isLoading } =
    useReverseLocation();

  React.useEffect(() => {
    setCoordinate(coordinate);
  }, [coordinate]);

  React.useEffect(() => {
    if (firstLoadData && onCoordinateChange) {
      const displayName = [
        firstLoadData.features[0]?.properties?.name,
        firstLoadData.features[0]?.properties?.street,
        firstLoadData.features[0]?.properties?.locality,
        firstLoadData.features[0]?.properties?.district,
        firstLoadData.features[0]?.properties?.city,
        firstLoadData.features[0]?.properties?.country,
      ]
        .filter((v) => !!v)
        .join(", ");

      onCoordinateChange?.({
        display_name: displayName,
        lat: firstLoadData.features[0].geometry.coordinates[1],
        lon: firstLoadData.features[0].geometry.coordinates[0],
      });
    }
  }, [firstLoadData]);

  const { width, height } = useWindowDimensions();
  const topPosition = React.useMemo(() => [100, height / 1.5], [height]);
  const top = useSharedValue(topPosition[1]);
  const prevTop = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    top: top.value,
  }));

  const keyboard = useAnimatedKeyboard();

  useAnimatedReaction(
    () => {
      return keyboard.height.value;
    },
    (result, previous) => {
      if (result !== previous) {
        if (result > 0) {
          top.value = withTiming(topPosition[0], { duration: 100 });
        }
      }
    }
  );

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTop.value = top.value;
    })
    .onUpdate((event) => {
      if (
        prevTop.value + event.translationY < topPosition[0] ||
        prevTop.value + event.translationY > topPosition[1]
      )
        return;
      top.value = prevTop.value + event.translationY;
    })
    .onEnd(() => {
      if (top.value <= height / 2.2) {
        top.value = withTiming(topPosition[0], { duration: 100 });
      } else {
        top.value = withTiming(topPosition[1], { duration: 100 });
      }
    })
    .runOnJS(true);

  React.useEffect(() => {
    const backAction = () => {
      if (top.value === topPosition[0]) {
        top.value = withTiming(topPosition[1], { duration: 100 });
      } else {
        router.back();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.container,
          { width, height, top: topPosition[1] },
          animatedStyles,
        ]}
      >
        <VStack
          space="md"
          className="rounded-t-[32px] bg-white p-[16px] flex-1 shadow-md"
        >
          <Box className="w-[75px] h-[3px] bg-gray-500 self-center mb-[12px] rounded-full" />
          <LocationSearchTripRequest
            onConfirm={onConfirm}
            isShareHide={isShareHide}
            onQueryFullfiled={() =>
              (top.value = withTiming(topPosition[1], { duration: 100 }))
            }
          />
          <Divider />
          {!!title && !!subTitle && (
            <Box>
              <Heading>Gợi ý</Heading>
              <Pressable
                onPress={() => {
                  onCoordinateChange?.({
                    display_name: [title, subTitle]
                      .filter((v) => !!v)
                      .join(","),
                    lat: data.features[0].geometry.coordinates[1],
                    lon: data.features[0].geometry.coordinates[0],
                  });
                  onPress?.({
                    display_name: [title, subTitle]
                      .filter((v) => !!v)
                      .join(","),
                    lat: data.features[0].geometry.coordinates[1],
                    lon: data.features[0].geometry.coordinates[0],
                  });
                }}
              >
                <VStack className="p-4">
                  <Heading>{title}</Heading>
                  <Text>{subTitle}</Text>
                </VStack>
              </Pressable>
            </Box>
          )}
        </VStack>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    zIndex: 3,
  },
});

export default CreateTripBottomSheet;
