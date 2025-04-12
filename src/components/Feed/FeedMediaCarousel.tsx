import React from "react";
import { CameraImageSize } from "@/src/constants";
import { useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { Image } from "expo-image";
import { Box } from "../ui/box";

const FeedMediaCarousel: React.FC<{ feedMedia: IFeedMedia[] }> = ({
  feedMedia,
}) => {
  const { width } = useWindowDimensions();

  const imageHeight = React.useMemo(
    () => width * (CameraImageSize.height / CameraImageSize.width),
    [width]
  );
  if (!feedMedia?.length) {
    return <></>;
  }
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
      data={feedMedia || []}
      renderItem={renderImage}
      width={width}
      height={imageHeight}
    />
  ) : (
    renderImage({ item: feedMedia[0], index: 0 })
  );
};

export default FeedMediaCarousel;
