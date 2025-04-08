import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { CameraImageSize } from "@/src/constants";
import AppColors from "@/src/constants/colors";
import { router } from "expo-router";
import React, { useRef } from "react";
import { StatusBar, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

export default function ImageSelection() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);

  const { hasPermission, requestPermission } = useCameraPermission();

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    try {
      const photo = await camera.current.takePhoto({});
      console.log(photo.path);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box className="flex-1 bg-black">
      <StatusBar translucent backgroundColor={"transparent"} />
      <Box
        style={{
          width,
          height: width * (CameraImageSize.height / CameraImageSize.width),
          overflow: "hidden",
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        {router.canGoBack() && (
          <Box
            className="absolute left-[16px] bg-xedi-background/[0.8] rounded-full"
            style={{
              top: insets.top,
              zIndex: 2,
              width: scale(24),
              height: scale(24),
            }}
          >
            <Button action="default" className="flex-1" onPress={router.back}>
              <ChevronLeftIcon size={scale(18)} color={AppColors.text} />
            </Button>
          </Box>
        )}
        {!!device && (
          <Camera
            ref={camera}
            style={{
              flex: 1,
            }}
            device={device}
            isActive={true}
            photo={true}
          />
        )}
      </Box>
      <Center
        className="w-full absolute left-0 right-0"
        style={{ bottom: insets.bottom + scale(16) }}
      >
        <Button
          onPress={takePicture}
          className="h-[70px] w-[70px] rounded-full"
          variant="outline"
        >
          <Box className="h-[50px] w-[50px] bg-white rounded-full" />
        </Button>
      </Center>
    </Box>
  );
}
