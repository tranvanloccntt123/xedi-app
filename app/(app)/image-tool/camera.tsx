import ChevronLeftIcon from "@/src/components/icons/ChevronLeftIcon";
import { Box } from "@/src/components/ui/box";
import { Button } from "@/src/components/ui/button";
import { Center } from "@/src/components/ui/center";
import { CameraImageSize } from "@/src/constants";
import AppColors from "@/src/constants/colors";
import { router } from "expo-router";
import React, { useRef } from "react";
import {
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, ScaledSheet } from "react-native-size-matters";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { Asset, getAssetsAsync, usePermissions } from "expo-media-library";
import { HStack } from "@/src/components/ui/hstack";
import { useDispatch } from "react-redux";
import { setImage } from "@/src/store/markImage/markImageSlice";

const ImageThumbnail: React.FC<object> = () => {
  const [image, setImage] = React.useState<Asset>();
  const [permissionResponse, requestPermission] = usePermissions();

  React.useEffect(() => {
    const getThumbnail = async () => {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
    };

    getThumbnail();
  }, []);

  React.useEffect(() => {
    if (permissionResponse?.status === "granted") {
      getAssetsAsync()
        .then((page) => {
          setImage(page.assets[0]);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [permissionResponse]);

  return (
    <TouchableOpacity
      onPress={() => router.replace("/image-tool/image-selection")}
    >
      <Box>
        {!!image && (
          <Image source={{ uri: image.uri }} style={styles.thumbnail} />
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default function PostCamera() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const dispatch = useDispatch();
  const { hasPermission, requestPermission } = useCameraPermission();

  React.useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    try {
      const photo = await camera.current.takePhoto({});
      dispatch(
        setImage(
          Platform.OS === "android" ? `file://${photo.path}` : photo.path
        )
      );
      router.replace(`image-tool/edit-image`);
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
          <Button
            action="default"
            className="absolute left-[16px] bg-xedi-background/[0.8] rounded-full p-0 justify-center items-center"
            style={{
              top: insets.top,
              zIndex: 2,
              width: scale(24),
              height: scale(24),
            }}
            onPress={router.back}
          >
            <ChevronLeftIcon size={scale(18)} color={AppColors.text} />
          </Button>
        )}
        {!!device && (
          <Camera
            ref={camera}
            style={{ flex: 1 }}
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
        <HStack
          className="w-full justify-between items-center"
          style={{ paddingRight: scale(56), paddingLeft: scale(16) }}
        >
          <ImageThumbnail />
          <Center className="flex-1">
            <Button
              onPress={takePicture}
              className="h-[70px] w-[70px] rounded-full"
              variant="outline"
            >
              <Box className="h-[50px] w-[50px] bg-white rounded-full" />
            </Button>
          </Center>
        </HStack>
      </Center>
    </Box>
  );
}

const styles = ScaledSheet.create({
  thumbnail: {
    width: "40@s",
    height: "40@s",
    resizeMode: "contain",
    borderRadius: "5@s",
    borderWidth: 1,
    borderColor: "white",
  },
});
