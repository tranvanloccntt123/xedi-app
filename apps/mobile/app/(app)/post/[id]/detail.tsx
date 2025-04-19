import React from "react";
import { TouchableOpacity } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Box } from "@/src/components/ui/box";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import AppColors from "@/src/constants/colors";
import { router, useLocalSearchParams } from "expo-router";
import { xediSupabase } from "supabase-client";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { PartTypes, Tables } from "@/src/constants";
import AppLoading from "@/src/components/View/AppLoading";
import MentionText from "@/src/components/ControlledMentions/components/mention-text";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";
import moment from "moment";
import FeedMediaCarousel from "@/src/components/Feed/FeedMediaCarousel";
import { Text } from "react-native";
import { Button } from "@/src/components/ui/button";
import CloseIcon from "@/src/components/icons/CloseIcon";
import { scale } from "react-native-size-matters";
import "moment/locale/vi"; // Import the Vietnamese locale
// Set the locale globally for moment (optional, but good practice if you use it often)
moment.locale("vi");
// --- Component ---
export default function PostDetail() {
  const { id, defaultIndex } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
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

  const handleUsernamePress = () => {};

  // --- Render ---
  return (
    <AppLoading isLoading={!data}>
      {!!data && (
        <Box className="flex-1 bg-xedi-black">
          <SafeAreaView style={AppStyles.container}>
            {/* <Header title="Bài đăng" className="px-[16px]" /> */}
            <HStack className="py-2">
              <Button
                action="default"
                onPress={() => router.back()}
                className="self-start"
              >
                <CloseIcon size={scale(24)} color={AppColors.white} />
              </Button>
            </HStack>
            <FeedMediaCarousel
              feedMedia={data?.feed_media || []}
              defaultIndex={!!defaultIndex ? Number(defaultIndex) : 0}
            />
          </SafeAreaView>
          {/* 5. Caption */}
          <Box
            className="px-3 pb-1 absolute bg-xedi-black/[.6] left-0 right-0 bottom-0"
            style={{ zIndex: 9, paddingBottom: insets.bottom }}
          >
            <HStack
              space="sm"
              className="items-center"
              style={{ paddingTop: insets.top, zIndex: 9 }}
            >
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
                <Text
                  style={wrapTextStyle(
                    { fontWeight: "500", color: AppColors.white },
                    "2xs"
                  )}
                >
                  {data?.users?.name}
                </Text>
              </TouchableOpacity>
            </HStack>
            {/* Using RNText for nested Text components to allow different styling */}
            <MentionText
              value={data?.content || ""}
              partTypes={PartTypes as any}
              textStyle={wrapTextStyle(
                { fontWeight: "500", color: AppColors.white },
                "sm"
              )}
            />
            <Box className="pb-3">
              <Text
                style={wrapTextStyle(
                  { fontWeight: "400", color: AppColors.white, opacity: 0.5 },
                  "xs"
                )}
              >
                {moment(data?.created_at).fromNow()}
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </AppLoading>
  );
}
