const APP_STRUCT = "HOME_SCREEN";

import React from "react";
import { Box } from "@/src/components/ui/box";
import { Heading } from "@/src/components/ui/heading";
import { VStack } from "@/src/components/ui/vstack";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { Pressable } from "react-native";
import { Text } from "@/src/components/ui/text";
import NewsFeedItem from "@/src/components/Feed/NewsFeedItem";
import { INewsFeedItem } from "@/src/types";
import { Button, ButtonText } from "@/src/components/ui/button";
import { useRouter } from "expo-router";
import { HStack } from "@/src/components/ui/hstack";
import AddIconInLine from "@/src/components/icons/AddIconInline";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { xediSupabase } from "@/src/lib/supabase";
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import FeedBottomSheet from "@/src/components/Feed/FeedBottomSheet";
import useLocation from "@/hooks/useLocation";
import OnlyCustomer from "@/src/components/View/OnlyCustomer";
import LocationIcon from "@/src/components/icons/LocationIcon";
import AddIcon from "@/src/components/icons/AddIcon";
import InfinityList from "@/src/components/InfinityList";
import { setTripRequests } from "@/src/store/tripRequest/tripRequestsSlice";
import {
  pushFetchingInfo,
  XEDI_GROUP_INFO,
} from "@/src/store/fetchServices/fetchServicesSlice";

export default function Home() {
  useLocation({});
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const { top } = useSafeAreaInsets();

  const router = useRouter();

  const renderItem = ({ item }: { item: INewsFeedItem }) => (
    <NewsFeedItem item={item} />
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-gray-100" style={{ paddingTop: top }}>
        <InfinityList
          queryFn={async (lastPage) => {
            const { data } = await xediSupabase.tables.feed.selectFeedAfterId({
              date: lastPage,
            });
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_GROUP_INFO.FEED,
                data,
              })
            );
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_GROUP_INFO.TRIP_REQUEST,
                data: data
                  .filter((_data) => !!_data.trip_requests)
                  .flatMap((_data) => _data.trip_requests),
              })
            );
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_GROUP_INFO.FIXED_ROUTE,
                data: data
                  .filter((_data) => !!_data.fixed_routes)
                  .flatMap((_data) => _data.fixed_routes),
              })
            );
            return data;
          }}
          getLastPageNumber={(lastData: INewsFeedItem[]) => {
            return lastData?.[lastData.length - 1]?.created_at;
          }}
          renderItem={renderItem}
          ListHeaderComponent={
            <VStack space="md">
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
                  onPress={() => router.push("/post/create")}
                  variant="link"
                  className="w-[40px] h-[40px] bg-typography-100 rounded-full"
                >
                  <AddIconInLine size={24} color={"#000000"} />
                </Button>
              </HStack>
              <OnlyCustomer>
                <VStack
                  space="sm"
                  className="p-2 border-[1px] border-gray-200 bg-white mb-4 mx-2 rounded-xl"
                >
                  <Pressable
                    onPress={() =>
                      router.navigate("/trip/create?type=end-location")
                    }
                  >
                    <HStack
                      space="md"
                      className="p-4 rounded-md items-center bg-gray-100"
                    >
                      <LocationIcon size={24} color="#f56505" />
                      <Text className="text-black">Bạn muốn đến đâu</Text>
                    </HStack>
                  </Pressable>
                  <HStack>
                    <Button variant="link">
                      <AddIcon size={24} color="rgb(52, 170, 246)" />
                      <ButtonText className="font-[400] text-sm">
                        Thêm điểm đón
                      </ButtonText>
                    </Button>
                  </HStack>
                </VStack>
              </OnlyCustomer>
            </VStack>
          }
        />
      </Box>
      <FeedBottomSheet />
    </BottomSheet>
  );
}
