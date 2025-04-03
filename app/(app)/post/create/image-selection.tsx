import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { CameraImageSize } from "@/src/constants";
import { router } from "expo-router";
import React, { useRef } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
          <Box className="absolute left-[16px]" style={{ top: insets.top }}>
            <Button variant="link" onPress={router.back}>
              <ChevronLeftIcon size={24} color="#fff" />
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
      <Box className="flex-1">
        <Center className="flex-1">
          <Button
            onPress={takePicture}
            className="h-[70px] w-[70px] rounded-full"
            variant="outline"
          >
            <Box className="h-[50px] w-[50px] bg-white rounded-full" />
          </Button>
        </Center>
      </Box>
    </Box>
  );
}
