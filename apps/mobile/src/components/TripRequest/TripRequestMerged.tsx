import React from "react";
import { router } from "expo-router";
import TripRequestDriverHandleLayout from "./TripRequestDriverHandleLayout";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import { xediSupabase } from "supabase-client";
import { VStack } from "../ui/vstack";
import { Text } from "../ui/text";
import useQuery from "@/hooks/useQuery";
import FixedRouteItem from "../FixedRoute/FixedRouteItem";
import { TouchableOpacity } from "react-native";

const TripRequestMerged: React.FC<{
  tripRequest: ITripRequest;
  onReject?: (driverTripRequestId: number) => any;
}> = ({ tripRequest, onReject }) => {
  const queryKey = `${XEDI_QUERY_KEY.FIXED_ROUTE}_${tripRequest.fixed_route_id}`;
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
            <Text className="text-lg font-bold mx-4 text-black">
              Tiện chuyến
            </Text>
            <TouchableOpacity
              onPress={() => router.navigate(`fixed/${data.id}/detail`)}
            >
              <FixedRouteItem isHiddenPrice fixedRoute={data} disabled />
            </TouchableOpacity>
          </VStack>
        )
      }
    />
  );
};

export default TripRequestMerged;
