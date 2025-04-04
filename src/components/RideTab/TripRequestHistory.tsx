import React from "react";
import { Box } from "../ui/box";
import { xediSupabase } from "@/src/lib/supabase";
import InfinityList from "../InfinityList";
import TripRequestItem from "../TripRequest/TripRequestItem";
import { Pressable } from "react-native";
import { router } from "expo-router";

const TripRequestHistory: React.FC<object> = () => {
  return (
    <Box className="flex-1 py-4">
      <InfinityList
        renderItem={function (data: {
          item: ITripRequest;
          index: number;
        }): React.ReactNode {
          return (
            <Box className="px-2 mb-4">
              <Pressable
                onPress={() => router.navigate(`trip/${data.item.id}/detail`)}
              >
                <TripRequestItem tripRequest={data.item} disabled />
              </Pressable>
            </Box>
          );
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          const { data } =
            await xediSupabase.tables.tripRequest.selectByUserIdBeforeDate({
              date: lastPage,
            });
          return data as never;
        }}
        getLastPageNumber={function (lastData: ITripRequest[]) {
          return lastData?.[lastData.length - 1]?.created_at;
        }}
      />
    </Box>
  );
};

export default TripRequestHistory;
