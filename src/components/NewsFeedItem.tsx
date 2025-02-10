import React from "react";
import { useEffect } from "react";
import type { INewsFeedItem } from "@/src/types";
import moment from "moment";
import { Box } from "./ui/box";
import { VStack } from "./ui/vstack";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import FixedRouteItem from "./FixedRouteItem";
import { Platform, ScrollView } from "react-native";
import MoreIcon from "./icons/MoreIcon";
import { BottomSheetTrigger } from "./ui/bottom-sheet";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNewsFeedItem } from "@/src/store/feedSlice";
import type { RootState } from "@/src/store/store";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";

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
      <VStack space="sm" className="mb-2">
        <Box className="bg-white p-4 rounded-lg">
          <VStack>
            <HStack className="justify-between items-center">
              <Text className="font-bold">{item.users.name}</Text>
              <BottomSheetTrigger onPress={handleMoreClick}>
                <MoreIcon color="#000000" size={24} />
              </BottomSheetTrigger>
            </HStack>
            <Text className="text-gray-500 text-xs mb-4">
              {moment(item.created_at).fromNow()}
            </Text>
            <Text>{item.content}</Text>
          </VStack>
        </Box>
        {!!item?.fixed_routes?.length && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={Platform.OS === "web"}
          >
            <HStack space="md" className="mb-4">
              {item.fixed_routes.map((fixedRoute) => (
                <FixedRouteItem
                  fixedRoute={fixedRoute}
                  key={fixedRoute.id}
                  className="mx-0"
                />
              ))}
            </HStack>
          </ScrollView>
        )}
      </VStack>
    </Animated.View>
  );
};

export default NewsFeedItem;
