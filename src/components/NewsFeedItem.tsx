import React from "react";
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
import { useDispatch } from "react-redux";
import { setCurrentNewsFeedItem } from "@/src/store/feedSlice";

interface NewsFeedItemProps {
  item: INewsFeedItem;
}

const NewsFeedItem: React.FC<NewsFeedItemProps> = ({ item }) => {
  const dispatch = useDispatch();

  const handleMoreClick = () => {
    dispatch(setCurrentNewsFeedItem(item));
  };

  return (
    <VStack space="sm" className="mb-1">
      <Box className="bg-white p-4 rounded-lg shadow-sm">
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
  );
};

export default NewsFeedItem;
