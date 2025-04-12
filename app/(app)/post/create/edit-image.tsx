import React from "react";
import { Box } from "@/src/components/ui/box";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import {
  SkiaDomView,
  Canvas,
  Image,
  LinearGradient,
  Rect,
  Skia,
  SkImage,
  Text,
  useFont,
  useImage,
  vec,
  ImageFormat,
} from "@shopify/react-native-skia";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";
import Header from "@/src/components/Header";
import { useWindowDimensions } from "react-native";
import { CameraImageSize } from "@/src/constants";
import useLocation from "@/hooks/useLocation";
import { Inter_400Regular } from "@expo-google-fonts/inter";
import { scale } from "react-native-size-matters";
import AppColors from "@/src/constants/colors";
import moment from "moment";
import AppImages from "@/assets/images";
import { Button, ButtonText } from "@/src/components/ui/button";
import axios from "axios";
import { splitLocation } from "@/src/utils";
import { addImage } from "@/src/store/postForm/postFormSlice";

import "moment/locale/vi"; // Import the Vietnamese locale
// Set the locale globally for moment (optional, but good practice if you use it often)
moment.locale("vi");

export default function EditImage() {
  useLocation({});
  const canvasRef = React.useRef<SkiaDomView>(null);
  const { lat, lon, granted } = useSelector(
    (state: RootState) => state.location
  );
  const logo = useImage(AppImages.LOGO);
  const timeFont = useFont(Inter_400Regular, scale(40));
  const dateFont = useFont(Inter_400Regular, scale(14));
  const locationFont = useFont(Inter_400Regular, scale(12));
  const { image } = useSelector((state: RootState) => state.markImage);
  const { width } = useWindowDimensions();
  const height = React.useMemo(
    () => width * (CameraImageSize.height / CameraImageSize.width),
    [width]
  );
  const dispatch = useDispatch();
  const backgroundImage = useImage(image);
  const [data, setData] = React.useState<PhotonReverseResponse>();
  const [isLoading, setIsLoading] = React.useState(false);
  // React.useEffect(() => {
  //   if (!image) {
  //     router.back();
  //   }
  //   // A sample base64-encoded pixel
  //   const data = Skia.Data.fromBase64(image);
  //   const _image = Skia.Image.MakeImageFromEncoded(data);
  //   setBackgroundImage(_image);
  // }, [image]);

  React.useEffect(() => {
    if (granted && lat && lon) {
      (async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`,
            {
              headers: {
                "access-control-allow-origin": "*",
              },
              timeout: 30000,
            }
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [lat, lon, granted]);

  const { title, subTitle } = React.useMemo(() => {
    if (!data && !data?.features.length) {
      return {
        title: "",
        subTitle: "",
      };
    }
    return splitLocation(
      [
        data.features[0]?.properties?.name,
        data.features[0]?.properties?.street,
        data.features[0]?.properties?.locality,
        data.features[0]?.properties?.district,
        data.features[0]?.properties?.city,
        data.features[0]?.properties?.country,
      ]
        .filter((v) => !!v)
        .join(", ")
    );
  }, [data]);

  return (
    <Box className="flex-1 bg-xedi-background">
      <SafeAreaView style={AppStyles.container}>
        <Header
          title=""
          className="px-[16px]"
          rightComponent={
            <Button
              action="default"
              onPress={async () => {
                if (isLoading || !logo) {
                  return;
                }
                const image = await canvasRef.current?.makeImageSnapshot();
                const base64 = image.encodeToBase64(ImageFormat.JPEG);
                dispatch(addImage(base64));
                router.back();
              }}
            >
              <ButtonText
                className="color-xedi-primary"
                style={wrapTextStyle({ fontWeight: "500" }, "sm")}
              >
                Tiếp
              </ButtonText>
            </Button>
          }
        />
        <Box style={{ width, height }}>
          <Canvas style={AppStyles.container} ref={canvasRef}>
            {!!backgroundImage && (
              <Image
                image={backgroundImage}
                fit={"cover"}
                x={0}
                y={0}
                width={width}
                height={height}
              />
            )}
            <Image
              image={logo}
              fit={"contain"}
              x={scale(16)}
              y={scale(16)}
              width={scale(40)}
              height={scale(40)}
            />
            <Rect
              x={0}
              y={height - scale(200)}
              width={width}
              height={scale(200)}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(width, width / 2)}
                colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}
              />
            </Rect>
            <Text
              x={scale(16)}
              y={height - scale(150)}
              text={moment().format("HH:mm")}
              font={timeFont}
              color={AppColors.background}
            />
            <Text
              x={scale(16)}
              y={height - scale(125)}
              text={moment().format("LL")}
              font={dateFont}
              color={AppColors.background}
            />
            {!!title && (
              <Text
                x={scale(16)}
                y={height - scale(55)}
                text={title}
                font={locationFont}
                color={AppColors.background}
              />
            )}
            {!!subTitle && (
              <Text
                x={scale(16)}
                y={height - scale(35)}
                text={subTitle}
                font={locationFont}
                color={AppColors.background}
              />
            )}
          </Canvas>
        </Box>
      </SafeAreaView>
    </Box>
  );
}
