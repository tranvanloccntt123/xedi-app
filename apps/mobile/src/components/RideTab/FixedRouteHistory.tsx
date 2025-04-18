import React from "react";
import { Box } from "../ui/box";
import { xediSupabase } from "@/src/lib/supabase";
import InfinityList from "../InfinityList";
import FixedRouteOrderItem from "../FixedRoute/FixedRouteOrderItem";
import { Pressable } from "react-native";
import { router } from "expo-router";
import moment from "moment";
import { Text } from "../ui/text";
import "moment/locale/vi"; // Import the Vietnamese locale
// Set the locale globally for moment (optional, but good practice if you use it often)
moment.locale("vi");
const FixedRouteHistory: React.FC<object> = () => {
  return (
    <Box className="flex-1 py-4">
      <InfinityList
        renderItem={function (data: {
          item: IFixedRouteOrder;
          index: number;
          data: IFixedRouteOrder[];
        }): React.ReactNode {
          return (
            <Box className="px-4 mb-2">
              {(data.index === 0 ||
                moment(data.item?.created_at).format("DD/MM/YYYY") !=
                  moment(data.data[data.index - 1]?.created_at).format(
                    "DD/MM/YYYY"
                  )) && (
                <Box className="h-[35px] mt-[16px] justify-center">
                  <Text className="mb-2 text-md font-bold text-gray-500">
                    {moment(data.item?.created_at).format("DD/MM/YYYY")}
                  </Text>
                </Box>
              )}
              <Pressable
                onPress={() =>
                  router.navigate(
                    `(app)/fixed/${data.item.fixed_route_id}/detail`
                  )
                }
              >
                <FixedRouteOrderItem
                  fixedRouteOrder={data.item}
                  isDisabled={false}
                />
              </Pressable>
            </Box>
          );
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          const { data } =
            await xediSupabase.tables.fixedRouteOrders.selectByUserIdBeforeDate(
              {
                date: lastPage,
              }
            );
          return data as never;
        }}
        getLastPageNumber={function (lastData: ITripRequest[]) {
          return lastData?.[lastData.length - 1]?.created_at;
        }}
      />
    </Box>
  );
};

export default FixedRouteHistory;
