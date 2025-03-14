import React from "react";
import { Box } from "../ui/box";
import InfinityList from "../InfinityList";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { IDriverTripRequest } from "@/src/types";
import TripRequestItem from "../TripRequest/TripRequestItem";

const DriverTripRequestAccepted: React.FC<object> = () => {
  return (
    <Box className="flex-1 py-4">
      <InfinityList
        renderItem={function (data: {
          item: IDriverTripRequest;
          index: number;
        }): React.ReactNode {
          return (
            data.item.trip_requests && (
              <Box className="px-2 mb-2">
                <TripRequestItem tripRequest={data.item.trip_requests} />
              </Box>
            )
          );
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          const { data } =
            await xediSupabase.tables.driverTripRequests.selectByUserIdBeforeDate(
              {
                date: lastPage,
                select: `*, ${Tables.TRIP_REQUESTS}(*)`,
              }
            );
          return data as never;
        }}
        getLastPageNumber={function (lastData: any[]) {
          return lastData[lastData.length - 1].created_at;
        }}
      />
    </Box>
  );
};

export default DriverTripRequestAccepted;
