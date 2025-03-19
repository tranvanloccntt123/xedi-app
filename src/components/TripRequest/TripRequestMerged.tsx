import React from "react";
import { Button, ButtonText } from "@/src/components/ui/button";
import { IFixedRoute, ITripRequest } from "@/src/types";
import ChevronRightIcon from "../icons/ChevronRightIcon";
import { router } from "expo-router";
import TripRequestDriverHandleLayout from "./TripRequestDriverHandleLayout";
import { XEDI_GROUP_INFO } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "@/src/lib/supabase";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import useQuery from "@/hooks/useQuery";
import FixedRouteItem from "../FixedRoute/FixedRouteItem";

const TripRequestMerged: React.FC<{
  tripRequest: ITripRequest;
  onReject?: (driverTripRequestId: number) => any;
}> = ({ tripRequest, onReject }) => {
  const queryKey = `${XEDI_GROUP_INFO.FIXED_ROUTE}_${tripRequest.fixed_route_id}`;
  const queryFn = async () => {
    const { data, error } = await xediSupabase.tables.fixedRoutes.selectById(
      tripRequest.fixed_route_id
    );
    if (error) {
      throw error;
    }
    return data[0] as IFixedRoute;
  };
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn,
  });
  return (
    <TripRequestDriverHandleLayout
      tripRequest={tripRequest}
      onReject={onReject}
      mergeComponent={
        !!data && (
          <VStack space="md" className="my-2">
            <Text className="text-lg font-bold mx-4 text-black">Tiện chuyến</Text>
            <FixedRouteItem isHiddenPrice fixedRoute={data} disabled />
          </VStack>
        )
      }
    />
  );
};

export default TripRequestMerged;
