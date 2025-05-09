import React from "react";
import { Box } from "@/src/components/ui/box";
import { useDispatch } from "react-redux";
import NewsFeedItem from "@/src/components/Feed/NewsFeedItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {xediSupabase} from 'supabase-client';
import { BottomSheet } from "@/src/components/ui/bottom-sheet";
import FeedBottomSheet from "@/src/components/Feed/FeedBottomSheet";
import useLocation from "@/hooks/useLocation";
import InfinityList from "@/src/components/InfinityList";
import {
  pushFetchingInfo,
  XEDI_QUERY_KEY,
} from "@/src/store/fetchServices/fetchServicesSlice";

import HomeHeader from "@/src/components/Home/HomeHeader";

export default function Home() {
  useLocation({});
  const dispatch = useDispatch();
  const { top } = useSafeAreaInsets();

  const renderItem = ({ item }: { item: INewsFeedItem }) => (
    <NewsFeedItem item={item} />
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-xedi-background" style={{ paddingTop: top }}>
        <InfinityList
          queryFn={async (lastPage) => {
            const { data } = await xediSupabase.tables.feed.selectFeedAfterId({
              date: lastPage,
            });
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_QUERY_KEY.FEED,
                data,
              })
            );
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_QUERY_KEY.TRIP_REQUEST,
                data: data
                  .filter((_data) => !!_data.trip_requests)
                  .flatMap((_data) => _data.trip_requests),
              })
            );
            dispatch(
              pushFetchingInfo({
                groupKey: XEDI_QUERY_KEY.FIXED_ROUTE,
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
          ListHeaderComponent={<HomeHeader />}
        />
      </Box>
      <FeedBottomSheet />
    </BottomSheet>
  );
}
