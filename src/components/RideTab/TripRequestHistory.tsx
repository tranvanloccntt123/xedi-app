import React from "react";
import { Box } from "../ui/box";
import { ITripRequest } from "@/src/types";
import { xediSupabase } from "@/src/lib/supabase";
import InfinityList from "../InfinityList";
import TripRequestItem from "../TripRequest/TripRequestItem";

const TripRequestHistory: React.FC<object> = () => {
  return (
    <Box className="flex-1 py-4">
      <InfinityList
        renderItem={function (data: {
          item: ITripRequest;
          index: number;
        }): React.ReactNode {
          return (
            <Box className="px-2 mb-2">
              <TripRequestItem tripRequest={data.item} />
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
