import React from "react";
import { IFixedRoute, ITripRequest, IUser } from "@/src/types";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { xediSupabase } from "@/src/lib/supabase";
import { VStack } from "@/src/components/ui/vstack";
import { HStack } from "@/src/components/ui/hstack";
import { Heading } from "@/src/components/ui/heading";
import { useNavigation } from "expo-router";
import TripRequestItem from "../TripRequest/TripRequestItem";

const FixedRouteMergeList: React.FC<{
  fixedRoute: IFixedRoute;
  isRefreshing?: boolean;
}> = ({ fixedRoute, isRefreshing }) => {
  const navigation = useNavigation();
  const focused = navigation.isFocused();
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const [listFixedRouteRequest, setFixedRouteRequest] = React.useState<
    ITripRequest[]
  >([]);

  const loadData = async () => {
    const { data } =
      await xediSupabase.tables.tripRequest.selectAfterId({
        filter: [
          {
            filed: "fixed_route_id",
            filter: "eq",
            data: fixedRoute.id,
          },
        ],
      });
    setFixedRouteRequest(data as never);
  };

  React.useEffect(() => {
    if (user?.id || isRefreshing || focused) {
      loadData();
    }
  }, [user, isRefreshing, focused]);

  return user?.id === fixedRoute?.user_id && !!listFixedRouteRequest.length && (
    <VStack space="md">
      <HStack>
        <Heading className="flex-1">Ghép chuyến</Heading>
      </HStack>
      {listFixedRouteRequest.map((v) => (
        <TripRequestItem tripRequest={v} disabled={true} className="mx-0" />
      ))}
    </VStack>
  );
};

export default FixedRouteMergeList;
