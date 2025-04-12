import React from "react";
import {
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { Text } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";
import AppColors from "@/src/constants/colors";
import { scale, ScaledSheet } from "react-native-size-matters";
import { useLocalSearchParams } from "expo-router";
import { xediSupabase } from "@/src/lib/supabase";
import ChatIcon from "@/src/components/icons/ChatIcon";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { CameraImageSize, PartTypes, Tables } from "@/src/constants";
import AppLoading from "@/src/components/View/AppLoading";
import Carousel from "react-native-snap-carousel";
import { Image } from "expo-image";
import MentionText from "@/src/components/ControlledMentions/components/mention-text";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";
import moment from "moment";
import Header from "@/src/components/Header";

// --- Component ---
export default function PostDetail() {
  const { id } = useLocalSearchParams();
  const { data, isLoading } = useQuery<INewsFeedItem>({
    queryKey: `${XEDI_QUERY_KEY.FEED}_${id}`,
    queryFn: async () => {
      const { data } = await xediSupabase.tables.feed.selectById(id, {
        query: `
                    id, 
                    content,
                    created_at,
                    ${Tables.FIXED_ROUTES} ( 
                      id, 
                      startLocation, 
                      endLocation, 
                      departureTime, 
                      totalSeats,
                      availableSeats,
                      price,
                      created_at 
                    ),
                    ${Tables.USERS} (*),
                    ${Tables.TRIP_REQUESTS} (*),
                    ${Tables.COMMENTS} (count),
                    ${Tables.FEED_MEDIA} (id, path, content_type)
                  `,
      });
      if (data?.[0]) {
        return data[0];
      }
    },
  });

  const { width } = useWindowDimensions();

  const imageHeight = React.useMemo(
    () => width * (CameraImageSize.height / CameraImageSize.width),
    [width]
  );

  const handleCommentPress = () => {};

  const handleUsernamePress = () => {};

  const renderImage = ({ item }: { item: IFeedMedia; index: number }) => {
    const imageWidth = width - scale(16);
    const imageHeight =
      imageWidth * (CameraImageSize.height / CameraImageSize.width);
    return (
      <Box style={{ width: imageWidth, height: imageHeight }}>
        <Image
          source={{
            uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/popular/${item.path}`,
          }}
          style={{ flex: 1 }}
          contentFit="contain"
        />
      </Box>
    );
  };

  // --- Render ---
  return (
    <AppLoading isLoading={isLoading}>
      {!!data && (
        <Box className="flex-1 bg-xedi-background">
          <SafeAreaView style={AppStyles.container}>
            <Header title="Bài đăng" className="px-[16px]" />
            <ScrollView style={AppStyles.container}>
              {/* 1. Post Header */}
              <HStack space="sm" className="p-3 items-center">
                <TouchableOpacity onPress={handleUsernamePress}>
                  <Avatar size="sm">
                    <AvatarFallbackText>
                      {data?.users?.name || "Xedi"}
                    </AvatarFallbackText>
                  </Avatar>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUsernamePress}
                  style={{ flex: 1 }}
                >
                  <Text size="sm" bold>
                    {data?.users?.name}
                  </Text>
                </TouchableOpacity>
              </HStack>

              {/* 2. Post Image/Video */}
              {/* For multiple images/videos, you'd use a FlatList horizontal with pagination */}
              {!!data?.feed_media?.length && (
                <Carousel
                  ref={(c) => {
                    this._carousel = c;
                  }}
                  data={data?.feed_media}
                  renderItem={renderImage}
                  sliderWidth={width}
                  itemWidth={imageHeight}
                  layout="default"
                />
              )}

              {/* 3. Action Bar */}
              <HStack space="md" className="p-3 items-center">
                <Button
                  variant="link"
                  onPress={handleCommentPress}
                  className="p-1"
                >
                  <ChatIcon size={scale(24)} color={AppColors.text} />
                </Button>
              </HStack>

              {/* 5. Caption */}
              <Box className="px-3 pb-1">
                {/* Using RNText for nested Text components to allow different styling */}
                <MentionText
                  value={data?.content || ""}
                  partTypes={PartTypes as any}
                  textStyle={wrapTextStyle({ fontWeight: "500" }, "sm")}
                />
              </Box>

              {/* 7. Timestamp */}
              <Box className="px-3 pb-3">
                <Text
                  style={wrapTextStyle(
                    { fontWeight: "500", color: AppColors.placeholder },
                    "xs"
                  )}
                >
                  {moment(data?.created_at).fromNow()}
                </Text>
              </Box>
            </ScrollView>
          </SafeAreaView>
        </Box>
      )}
    </AppLoading>
  );
}

// --- Styles ---
const styles = ScaledSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.background, // Or 'white' like Instagram
  },
  container: {
    flex: 1,
  },
  postImage: {
    backgroundColor: AppColors.placeholder, // Placeholder background while loading
  },
  // Using RNText styles for the caption to handle nested bolding
  captionText: {
    fontSize: scale(12), // Adjust size as needed
    color: AppColors.text,
    lineHeight: scale(18),
  },
  captionUsername: {
    fontWeight: "bold",
  },
});
