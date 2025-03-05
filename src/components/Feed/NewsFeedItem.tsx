import React from "react";
import { useEffect } from "react";
import type { INewsFeedItem } from "@/src/types";
import moment from "moment";
import { Box } from "../ui/box";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import { Text } from "../ui/text";
import FixedRouteItem from "../FixedRoute/FixedRouteItem";
import { Platform, Pressable, ScrollView } from "react-native";
import MoreIcon from "../icons/MoreIcon";
import { BottomSheetTrigger } from "../ui/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNewsFeedItem } from "@/src/store/feedSlice";
import type { RootState } from "@/src/store/store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { MentionInput } from "../ControlledMentions";
import { router } from "expo-router";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import TripRequestItem from "../TripRequest/TripRequestItem";

interface NewsFeedItemProps {
  item: INewsFeedItem;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ item }) => {
  const dispatch = useDispatch();
  const deletedItems = useSelector(
    (state: RootState) => state.feed.deletedItems
  );
  const opacity = useSharedValue(1);

  const handleMoreClick = () => {
    dispatch(setCurrentNewsFeedItem(item));
  };

  useEffect(() => {
    if (deletedItems.includes(item.id)) {
      opacity.value = withTiming(0, { duration: 500 });
    }
  }, [deletedItems, item.id, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      maxHeight: interpolate(opacity.value, [0, 1], [0, 9999]),
    };
  });

  if (deletedItems.includes(item.id) && opacity.value === 0) {
    return null;
  }

  return (
    <Animated.View style={animatedStyle}>
      <VStack space="sm" className="mb-4 bg-white">
        <Box className="p-4 rounded-lg">
          <VStack>
            <HStack className="justify-between items-center mb-2">
              <HStack space="md" className="justify-center items-center">
                <Avatar size="sm">
                  <AvatarFallbackText>{item.users.name}</AvatarFallbackText>
                </Avatar>
                <Text className="font-bold text-lg">{item.users.name}</Text>
              </HStack>
              <BottomSheetTrigger onPress={handleMoreClick}>
                <MoreIcon color="#000000" size={24} />
              </BottomSheetTrigger>
            </HStack>
            <Text className="text-gray-500 text-xs mb-4">
              {moment(item.created_at).fromNow()}
            </Text>
            <MentionInput
              editable={false}
              value={item.content}
              onChange={() => {}}
            />
          </VStack>
        </Box>
        {!!item?.fixed_routes?.length &&
          (item.fixed_routes.length === 1 ? (
            <Box className="mb-4">
              <Pressable
                key={item.fixed_routes[0].id}
                onPress={() =>
                  router.navigate(`/fixed/${item.fixed_routes[0].id}/detail`)
                }
                style={{ width: "100%" }}
              >
                <FixedRouteItem
                  fixedRoute={item.fixed_routes[0]}
                  className="mx-0 bg-gray-50 rounded-md w-full"
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
                {item.fixed_routes.map((fixedRoute) => (
                  <Pressable
                    key={fixedRoute.id}
                    onPress={() =>
                      router.navigate(`/fixed/${fixedRoute.id}/detail`)
                    }
                  >
                    <FixedRouteItem
                      fixedRoute={fixedRoute}
                      className="mx-0 bg-gray-50 rounded-md w-[280px]"
                      disabled
                    />
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          ))}

        {!!item?.trip_requests?.length &&
          (item.trip_requests.length === 1 ? (
            <Box className="mb-4">
              <Pressable
                key={item.trip_requests[0].id}
                onPress={() =>
                  router.navigate(`/trip/${item.trip_requests[0].id}/detail`)
                }
                style={{ width: "100%" }}
              >
                <TripRequestItem
                  tripRequest={item.trip_requests[0]}
                  className="mx-0 bg-gray-50 rounded-md w-full"
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
                {item.trip_requests.map((tripRequest) => (
                  <Pressable
                    key={tripRequest.id}
                    onPress={() =>
                      router.navigate(`/trip/${tripRequest.id}/detail`)
                    }
                  >
                    <TripRequestItem
                      tripRequest={tripRequest}
                      className="mx-0 bg-gray-50 rounded-md w-[280px]"
                      disabled
                    />
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          ))}
      </VStack>
    </Animated.View>
  );
};

export default NewsFeedItem;
