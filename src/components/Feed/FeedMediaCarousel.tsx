import React from "react";
import { CameraImageSize } from "@/src/constants";
import { useWindowDimensions } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { Box } from "../ui/box";

export type FeedMediaCarouselMethods = {
  getCarouselIndex: () => number;
};

const FeedMediaCarousel = React.forwardRef<
  FeedMediaCarouselMethods,
  { feedMedia: IFeedMedia[]; defaultIndex?: number }
>(({ feedMedia, defaultIndex }, ref) => {
  const { width } = useWindowDimensions();

  const carouselRef = React.useRef<ICarouselInstance>(null);

  const imageHeight = React.useMemo(
    () => width * (CameraImageSize.height / CameraImageSize.width),
    [width]
  );
  if (!feedMedia?.length) {
    return <></>;
  }

  React.useImperativeHandle(ref, () => ({
    getCarouselIndex() {
      return carouselRef.current?.getCurrentIndex?.() || 0;
    },
  }));

  const renderImage = ({ item }: { item: IFeedMedia; index: number }) => {
    return (
      <Box style={{ width, height: imageHeight }}>
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/popular/${item?.path}`,
          }}
          style={{ flex: 1 }}
          contentFit="contain"
        />
      </Box>
    );
  };

  return feedMedia.length > 1 ? (
    <Carousel
      ref={carouselRef}
      data={feedMedia || []}
      renderItem={renderImage}
      width={width}
      height={imageHeight}
      defaultIndex={defaultIndex}
      // panGestureHandlerProps={{
      //   activeOffsetX: [-10, 10], // Enable horizontal panning
      //   failOffsetY: [-5, 5], // Limit vertical movement to fail the gesture
      // }}
    />
  ) : (
    renderImage({ item: feedMedia[0], index: 0 })
  );
});

export default FeedMediaCarousel;
