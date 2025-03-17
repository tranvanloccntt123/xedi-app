import React from "react";
import { Box } from "../ui/box";
import InfinityList from "../InfinityList";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { IDriverTripRequest, IDriverTripRequestStatus } from "@/src/types";
import TripRequestItem from "../TripRequest/TripRequestItem";
import { Pressable } from "react-native";
import { router } from "expo-router";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import { VStack } from "../ui/vstack";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RenderItem: React.FC<{ driverTripRequest: IDriverTripRequest }> = ({
  driverTripRequest,
}) => {
  const hideAnim = useSharedValue(1);
  const containerStyles = useAnimatedStyle(() => {
    return {
      opacity: hideAnim.value,
      minHeight: interpolate(hideAnim.value, [0, 1], [0, 99999]),
    };
  });

  return (
    driverTripRequest.trip_requests && (
      <Animated.View style={containerStyles}>
        <VStack className="px-2 mb-2 mb-4" space="md">
          <Pressable
            onPress={() =>
              router.navigate(
                `/trip/${driverTripRequest.trip_requests.id}/detail`
              )
            }
          >
            <TripRequestItem
              tripRequest={driverTripRequest.trip_requests}
              disabled
            />
          </Pressable>
        </VStack>
      </Animated.View>
    )
  );
};

const DriverTripRequestAccepted: React.FC<object> = () => {
  return (
    <Box className="flex-1 py-4">
      <InfinityList
        renderItem={function (data: {
          item: IDriverTripRequest;
          index: number;
        }): React.ReactNode {
          return <RenderItem driverTripRequest={data.item} />;
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          const { data } =
            await xediSupabase.tables.driverTripRequests.selectByUserIdBeforeDate(
              {
                date: lastPage,
                select: `*, ${Tables.TRIP_REQUESTS}(*)`,
                filter: [
                  {
                    filed: "status",
                    filter: "eq",
                    data: IDriverTripRequestStatus.PENDING,
                  },
                ],
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
