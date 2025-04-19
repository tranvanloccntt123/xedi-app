import React from "react";
import { Tables } from "@/src/constants";
import { xediSupabase } from "supabase-client";
import { RootState } from "@/src/store/store";
import { generateUUID } from "@/src/utils/uuid";
import { FlatList, Linking, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { Box } from "../ui/box";
import { Divider } from "../ui/divider";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";
import { HStack } from "../ui/hstack";
import HiIcon from "../icons/HiIcon";
import { scale } from "react-native-size-matters";
import { Button } from "../ui/button";
import PhoneIcon from "../icons/PhoneIcon";
import useQuery from "@/hooks/useQuery";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";

const FixedRouteRunningListCustomer: React.FC<{
  fixedRoute: IFixedRoute;
  onMoveTo?: (coordinate: { lat: number; lon: number }) => any;
}> = ({ fixedRoute, onMoveTo }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user?.id === fixedRoute?.user_id,
    [user, fixedRoute]
  );

  const { data: customerList } = useQuery<CustomerInFixedRoute[]>({
    queryKey: `${XEDI_QUERY_KEY.CUSTOMER_LIST}_${fixedRoute.id}`,
    async queryFn() {
      if (!isAuthor) {
        return [];
      }
      const list: CustomerInFixedRoute[] = [];
      const fixedRouteRequestList: IFixedRouteOrder[] = [];
      const mergeRequestList: ITripRequest[] = [];
      try {
        const { data: mergeRequest } =
          await xediSupabase.tables.tripRequest.selectAfterId({
            select: `*, ${Tables.USERS} (*)`,
            filter: [
              {
                filed: "fixed_route_id",
                filter: "eq",
                data: fixedRoute.id,
              },
            ],
          });
        !!mergeRequest && mergeRequestList.push(...mergeRequest);
      } catch (e) {}

      try {
        const { data: requestList } =
          await xediSupabase.tables.fixedRouteOrders.selectOrderByStatus(
            fixedRoute.id
          );
        !!requestList && fixedRouteRequestList.push(...(requestList as any));
      } catch (e) {}

      if (fixedRouteRequestList?.length) {
        list.push(
          ...fixedRouteRequestList.map((v) => ({
            id: generateUUID(),
            user: v.users,
            startLocation: v.location,
            endLocation: fixedRoute.endLocation,
            type: "FixedRouteOrder" as CustomerInFixedRouteType,
          }))
        );
      }

      if (mergeRequestList?.length) {
        list.push(
          ...mergeRequestList.map((v) => ({
            id: generateUUID(),
            user: v.users,
            startLocation: v.startLocation,
            endLocation: v.endLocation,
            type: "TripRequest" as CustomerInFixedRouteType,
          }))
        );
      }

      return list;
    },
  });

  return (
    <FlatList
      style={{ flex: 1 }}
      data={customerList}
      renderItem={({ item }) => (
        <Box>
          <VStack className="mb-2" space="xs">
            <HStack className="h-[55px] justify-between">
              <VStack>
                <Text className="font-bold text-black text-xl">
                  {item.user?.name}
                </Text>
                <Text className="text-md">{item.user?.phone}</Text>
              </VStack>
              <Button
                variant="link"
                action="default"
                className="p-3"
                onPress={() => Linking.openURL(`tel:${item.user?.phone}`)}
              >
                <PhoneIcon size={scale(24)} color="#000" />
              </Button>
            </HStack>
            {item.startLocation?.display_name && (
              <TouchableOpacity
                onPress={() =>
                  item.startLocation?.lat &&
                  item.startLocation?.lon &&
                  onMoveTo?.({
                    lat: item.startLocation?.lat,
                    lon: item.startLocation.lon,
                  })
                }
              >
                <HStack space="sm" className="items-center">
                  <HiIcon size={scale(18)} color="#000" />
                  <Text className="tet-md font-[500] flex-1">
                    {item.startLocation.display_name}
                  </Text>
                </HStack>
              </TouchableOpacity>
            )}
          </VStack>
          <Divider />
        </Box>
      )}
      keyExtractor={(item) => `${item.id}`}
    />
  );
};

export default FixedRouteRunningListCustomer;
