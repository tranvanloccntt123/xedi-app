import { Box } from "@/src/components/ui/box";
import React from "react";
import {
  Image,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scale, ScaledSheet } from "react-native-size-matters";
import { Asset, getAssetsAsync, usePermissions } from "expo-media-library";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import AppStyles from "@/src/theme/AppStyles";
import AppColors from "@/src/constants/colors";
import Header from "@/src/components/Header";
import { HStack } from "@/src/components/ui/hstack";
import { Button } from "@/src/components/ui/button";
import CameraShutterIcon from "@/src/components/icons/CameraShutterIcon";
import { router } from "expo-router";

const NUMS = 3;

export default function ImageSelection() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const itemWidth = React.useMemo(() => width / NUMS - 0.5, [width]);
  const [images, setImages] = React.useState<Asset[]>([]);
  const [imagePreview, setImagePreview] = React.useState<Asset>();
  const [permissionResponse, requestPermission] = usePermissions();
  const endCursor = React.useRef<string>();
  const hasNextPage = React.useRef<boolean>(true);
  const isLoading = React.useRef<boolean>(false);
  const offsetY = useSharedValue(0);

  React.useEffect(() => {
    const getThumbnail = async () => {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
    };

    getThumbnail();
  }, []);

  const fetchAssets = async () => {
    if (isLoading.current || !hasNextPage.current) {
      return;
    }
    isLoading.current = true;
    getAssetsAsync(endCursor.current ? { after: endCursor.current } : undefined)
      .then((page) => {
        endCursor.current = page.endCursor;
        hasNextPage.current = page.hasNextPage;
        setImages([...images, ...page.assets]);
        isLoading.current = false;
      })
      .catch(() => {
        isLoading.current = false;
      });
  };

  React.useEffect(() => {
    if (permissionResponse?.status === "granted") {
      fetchAssets();
    }
  }, [permissionResponse]);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetY.value = event.contentOffset.y;
  });

  const previewStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -offsetY.value,
        },
      ],
    };
  });

  const onSelectImage = (image: Asset) => {
    offsetY.value = withTiming(0, { duration: 200 });
    setImagePreview(image);
  };

  const renderItem = React.useCallback(
    ({ item, index }: { item: Asset; index: number }) => (
      <Box style={{ width: itemWidth, height: itemWidth, padding: scale(1) }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={0.8}
          onPress={() => onSelectImage(item)}
        >
          <Image source={{ uri: item.uri }} style={styles.thumbnail} />
        </TouchableOpacity>
      </Box>
    ),
    []
  );

  return (
    <Box className="flex-1 bg-xedi-background">
      <StatusBar translucent={false} backgroundColor={"transparent"} />
      <SafeAreaView style={AppStyles.container}>
        <Box
          style={[styles.navHeader, { paddingTop: insets.top }]}
          className="px-[16px]"
        >
          <Header title="Chọn ảnh" />
        </Box>
        <Animated.View
          style={[styles.previewContainer, { top: insets.top }, previewStyle]}
        >
          {!!imagePreview && (
            <Image
              source={{ uri: imagePreview.uri }}
              style={{ flex: 1, resizeMode: "contain" }}
            />
          )}
        </Animated.View>
        <Animated.FlatList
          bounces={false}
          data={images}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <Box>
              <Box style={styles.listHeader} />
              <HStack className="items-center justify-between">
                <Button
                  onPress={() => router.replace("/post/create/camera")}
                  style={styles.cameraBtn}
                  action="default"
                >
                  <CameraShutterIcon color={AppColors.text} size={scale(18)} />
                </Button>
              </HStack>
            </Box>
          }
          renderItem={renderItem}
          numColumns={NUMS}
          onScroll={scrollHandler}
          onEndReached={fetchAssets}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Box>
  );
}

const styles = ScaledSheet.create({
  thumbnail: {
    flex: 1,
    resizeMode: "cover",
  },
  listHeader: {
    height: "400@vs",
  },
  navHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 3,
    top: 0,
    backgroundColor: AppColors.background,
  },
  previewContainer: {
    width: "100%",
    height: "400@vs",
    position: "absolute",
    zIndex: 2,
    backgroundColor: AppColors.background,
  },
  cameraBtn: {
    width: "30@s",
    height: "30@s",
  },
});
