import React from "react";
import { useEffect } from "react";
import moment from "moment";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import FixedRouteItem from "../FixedRoute/FixedRouteItem";
import { Platform, Pressable, ScrollView, Text } from "react-native";
import MoreIcon from "../icons/MoreIcon";
import { BottomSheetTrigger } from "../ui/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNewsFeedItem } from "@/src/store/feed/feedSlice";
import type { RootState } from "@/src/store/store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { router } from "expo-router";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import TripRequestItem from "../TripRequest/TripRequestItem";
import { useDataInfo } from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { Button } from "../ui/button";
import ChatIcon from "../icons/ChatIcon";
import { PartTypes } from "@/src/constants";
import AppColors from "@/src/constants/colors";
import { scale } from "react-native-size-matters";
import { wrapTextStyle } from "@/src/theme/AppStyles";
import MentionText from "../ControlledMentions/components/mention-text";

interface NewsFeedItemProps {
  item: INewsFeedItem;
}

const NewsFeedItem = React.memo(({ item }: NewsFeedItemProps) => {
  const dispatch = useDispatch();

  const { data } = useDataInfo<INewsFeedItem>(
    `${XEDI_QUERY_KEY.FEED}_${item.id}`
  );

  const deletedItems = useSelector(
    (state: RootState) => state.feed.deletedItems
  );
  const opacity = useSharedValue(1);

  const handleMoreClick = () => {
    if (data) dispatch(setCurrentNewsFeedItem(data));
  };

  useEffect(() => {
    if (deletedItems.includes(data?.id)) {
      opacity.value = withTiming(0, { duration: 500 });
    }
  }, [deletedItems, data?.id, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      maxHeight: interpolate(opacity.value, [0, 1], [0, 9999]),
    };
  });

  if (deletedItems.includes(data?.id) && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <VStack space="sm" className="mb-4 bg-xedi-white">
        <Box className="p-4 rounded-lg">
          <VStack>
            <HStack className="justify-between items-center mb-2">
              <HStack space="md" className="justify-center items-center">
                <Avatar size="sm">
                  <AvatarFallbackText>{data?.users?.name}</AvatarFallbackText>
                </Avatar>
                <Text style={wrapTextStyle({ fontWeight: "700" }, "sm")}>
                  {data?.users?.name}
                </Text>
              </HStack>
              <BottomSheetTrigger onPress={handleMoreClick}>
                <MoreIcon color={AppColors.text} size={scale(20)} />
              </BottomSheetTrigger>
            </HStack>
            <Text
              style={wrapTextStyle(
                { fontWeight: "500", color: AppColors.placeholder },
                "xs"
              )}
            >
              {moment(data?.created_at).fromNow()}
            </Text>
            <MentionText
              value={data?.content || ""}
              partTypes={PartTypes as any}
              textStyle={wrapTextStyle({ fontWeight: "500" }, "2xs")}
            />
          </VStack>
        </Box>
        {!!data?.fixed_routes?.length &&
          (data.fixed_routes.length === 1 ? (
            <Box className="mb-4">
              <Pressable
                key={data.fixed_routes[0].id}
                onPress={() =>
                  router.navigate(`/fixed/${data.fixed_routes[0].id}/detail`)
                }
                style={{ width: "100%" }}
              >
                <FixedRouteItem
                  fixedRoute={data.fixed_routes[0]}
                  className="mx-0 rounded-none w-full"
                  disabled
                />
              </Pressable>
            </Box>
          ) : (
            <ScrollView
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={Platform.OS === "web"}
            >
              <HStack space="md" className="mb-4 px-2">
                {data.fixed_routes.map((fixedRoute) => (
                  <Pressable
                    key={fixedRoute.id}
                    onPress={() =>
                      router.navigate(`/fixed/${fixedRoute.id}/detail`)
                    }
                  >
                    <FixedRouteItem
                      fixedRoute={fixedRoute}
                      className="mx-0 rounded-none w-[280px]"
                      disabled
                    />
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          ))}

        {!!data?.trip_requests?.length &&
          (data.trip_requests.length === 1 ? (
            <Box className="mb-4">
              <Pressable
                key={data.trip_requests[0].id}
                onPress={() =>
                  router.navigate(`/trip/${data.trip_requests[0].id}/detail`)
                }
                style={{ width: "100%" }}
              >
                <TripRequestItem
                  tripRequest={data.trip_requests[0]}
                  className="mx-0 rounded-none w-full"
                  disabled
                />
              </Pressable>
            </Box>
          ) : (
            <ScrollView
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={Platform.OS === "web"}
            >
              <HStack space="md" className="mb-4 px-2">
                {data.trip_requests.map((tripRequest) => (
                  <Pressable
                    key={tripRequest.id}
                    onPress={() =>
                      router.navigate(`/trip/${tripRequest.id}/detail`)
                    }
                  >
                    <TripRequestItem
                      tripRequest={tripRequest}
                      className="mx-0 rounded-none w-[280px]"
                      disabled
                    />
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          ))}
        <HStack space="md" className="px-4 py-2">
          <Button
            variant="link"
            action="default"
            onPress={() => router.navigate(`post/${data.id}/comment`)}
          >
            <ChatIcon size={scale(16)} color="#000" />
            <Text
              style={wrapTextStyle(
                { fontWeight: "500", color: AppColors.text },
                "md"
              )}
            >
              {data.comments?.[0]?.count || 0}
            </Text>
          </Button>
        </HStack>
      </VStack>
    </Animated.View>
  );
});

export default NewsFeedItem;
