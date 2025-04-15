import React from "react";
import { Asset } from "expo-media-library";
import { Box } from "./ui/box";
import { useWindowDimensions, View } from "react-native";
import { CameraImageSize } from "../constants";
import Animated, {
  clamp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import { makeImageFromView } from "@shopify/react-native-skia";

export interface ImagePreviewMethods {
  getImageInfo: () => { x: number; y: number; scale: number };
  getBase64Image: () => Promise<string>;
}

const ImagePreview = React.forwardRef<ImagePreviewMethods, { image: Asset }>(
  ({ image }, ref) => {
    const { width } = useWindowDimensions();
    const height = React.useMemo(
      () => width * (CameraImageSize.height / CameraImageSize.width),
      [width]
    );
    // Gesture state
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);

    const scale = useSharedValue(1);
    const startScale = useSharedValue(0);

    const { imageWidth, imageHeight } = React.useMemo(() => {
      const imageSize = (image.width || 1) / (image.height || 1);

      let imageWidth = width;

      let imageHeight = imageWidth / imageSize;

      if (imageHeight < height) {
        imageWidth = height * imageSize;
      }

      imageHeight = imageWidth / imageSize;

      const initialScale = imageHeight / image.height;

      return {
        imageWidth: image.width * initialScale,
        imageHeight: image.height * initialScale,
      };
    }, [image, width, height]);

    const pan = Gesture.Pan()
      .onStart((e) => {
        prevTranslationX.value = translationX.value;
        prevTranslationY.value = translationY.value;
      })
      .onUpdate((event) => {
        translationX.value = prevTranslationX.value + event.translationX;
        translationY.value = prevTranslationY.value + event.translationY;
      })
      .runOnJS(true);

    const pinch = Gesture.Pinch()
      .onStart(() => {
        startScale.value = scale.value;
      })
      .onUpdate((event) => {
        scale.value = clamp(
          startScale.value * event.scale,
          0.2,
          Math.min(width / 100, height / 100)
        );
      })
      .runOnJS(true);

    // Refs for gesture handlers
    React.useEffect(() => {
      translationX.value = 0;
      translationY.value = 0;
      scale.value = 1;
      // calculateImagePosition();
    }, [image, width, height]);

    const translateStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ] as never,
    }));

    const scaleStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const multiGesture = Gesture.Simultaneous(pan, pinch);

    const viewRef = React.useRef<View>(null);

    React.useImperativeHandle(ref, () => {
      return {
        getImageInfo() {
          return {
            x: translationX.value,
            y: translationY.value,
            scale: scale.value,
          };
        },
        async getBase64Image() {
          const snapshot = await makeImageFromView(viewRef);
          return snapshot.encodeToBase64();
        },
      };
    });

    return (
      <View style={{ width, height }} ref={viewRef}>
        <GestureDetector gesture={multiGesture}>
          <Box style={{ width, height }}>
            <Box className="absolute top-0 left-0 right-0 bottom-0">
              <Image
                source={{ uri: image.uri }}
                style={[
                  {
                    width: imageWidth,
                    height: imageHeight,
                  },
                ]}
                contentFit="contain"
                blurRadius={90}
              />
            </Box>
            <Animated.View style={[translateStyle]}>
              <Animated.View style={[scaleStyle, { flex: 1 }]}>
                <Animated.Image
                  source={{ uri: image.uri }}
                  style={[
                    {
                      width: imageWidth,
                      height: imageHeight,
                      resizeMode: "contain",
                    },
                  ]}
                />
              </Animated.View>
            </Animated.View>
          </Box>
        </GestureDetector>
      </View>
    );
  }
);

export default ImagePreview;
