const APP_STRUCT = "HOME_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { VStack } from "@/src/components/ui/vstack";
import { useSelector } from "react-redux";
import type { RootState } from "@/src/store/store";
import { FlatList, Platform, RefreshControl } from "react-native";
import { Text } from "@/src/components/ui/text";
import NewsFeedItem from "@/src/components/NewsFeedItem";
import type { INewsFeedItem } from "@/src/types";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "expo-router";
import { HStack } from "@/src/components/ui/hstack";
import AddIconInLine from "@/src/components/icons/AddIconInline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { xediSupabase } from "@/src/lib/supabase";
import {
  BottomSheet,
} from "@/src/components/ui/bottom-sheet";
import FeedBottomSheet from "@/src/components/FeedBottomSheet";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const { top } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = React.useState(false);
  const [newsFeed, setNewsFeed] = React.useState([]);
  const router = useRouter();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      const { data } = await xediSupabase.tables.feed.selectFeedAfterId();
      if (data) {
        setNewsFeed(data);
      } // Just reverse the order for demo purposes
      setRefreshing(false);
    }, 2000);
  }, []);

  React.useEffect(() => {
    const test = async () => {
      const { data } = await xediSupabase.tables.feed.selectFeedAfterId();
      if (data) {
        setNewsFeed(data);
      }
    };

    test();
  }, []);

  const renderItem = ({ item }: { item: INewsFeedItem }) => (
    <NewsFeedItem item={item} />
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-gray-100" style={{ paddingTop: top }}>
        <FlatList
          data={newsFeed}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={Platform.OS === "web"}
          ListHeaderComponent={
            <HStack space="md" className="p-4">
              <VStack className="flex-1" space="md">
                <Heading size="lg">
                  Xin Chào, {user?.name || user?.phone}
                </Heading>
                <Text className="text-gray-600 mb-4">
                  Đây là bảng tin mới nhất của bạn. Kéo xuống để cập nhật.
                </Text>
              </VStack>
              <Button
                onPress={() => router.push("/create-post")}
                variant="link"
                className="w-[40px] h-[40px] bg-typography-100 rounded-full"
              >
                <AddIconInLine size={24} color={"#000000"} />
              </Button>
            </HStack>
          }
          contentContainerStyle={{ paddingHorizontal: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </Box>
      <FeedBottomSheet />
    </BottomSheet>
  );
}

