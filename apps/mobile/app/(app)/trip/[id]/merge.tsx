import React from "react";
import FixedRouteItem from "@/src/components/FixedRoute/FixedRouteItem";
import Header from "@/src/components/Header";
import InfinityList from "@/src/components/InfinityList";
import { Box } from "@/src/components/ui/box";
import { xediSupabase } from "@/src/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootState } from "@/src/store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from "@/src/components/ui/checkbox";
import { CheckIcon } from "@/src/components/ui/icon";
import { HStack } from "@/src/components/ui/hstack";
import { Button, ButtonText } from "@/src/components/ui/button";
import { fetchDetailInfo } from "@/src/store/fetchServices/fetchServicesThunk";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import {
  IDriverTripRequestStatus,
  IErrorRequest,
  IFixedRouteStatus,
} from "@/src/types/enum";

export default function MergeTripRequest() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const [checked, setChecked] = React.useState<number>(0);
  const queryKey = React.useMemo(
    () => `${XEDI_QUERY_KEY.TRIP_REQUEST}_${id}`,
    [id]
  );
  const driverRequest = useSelector(
    (state: RootState) => state.tripRequests.tripRequestAccepted[Number(id)]
  );
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!driverRequest) {
      router.back();
    }
  }, [driverRequest]);

  const handlerMergeTripRequest = async () => {
    if (!driverRequest || !checked) return;
    try {
      await xediSupabase.tables.fixedRoutes.updateById(driverRequest.id, {
        status: IDriverTripRequestStatus.DRIVER_MERGED_TRIP_REQUEST,
      });
      await xediSupabase.tables.tripRequest.updateById(id, {
        fixed_route_id: checked,
        status: IDriverTripRequestStatus.DRIVER_MERGED_TRIP_REQUEST,
      });
      dispatch(
        fetchDetailInfo({
          key: queryKey,
          async fetch() {
            try {
              const { data, error } =
                await xediSupabase.tables.tripRequest.selectById(id);
              if (error) {
                throw error;
              }
              if (data.length) {
                return data[0];
              }
              throw IErrorRequest.NOT_FOUND;
            } catch (e) {
              throw e;
            }
          },
        })
      );
      router.back();
    } catch (e) {}
  };

  return (
    !!driverRequest && (
      <Box className="flex-1" style={{ paddingTop: insets.top }}>
        <Box className="px-4">
          <Header title={"Ghép chuyến"} />
        </Box>
        <Box className="flex-1">
          <InfinityList
            renderItem={function (data: {
              item: IFixedRoute;
              index: number;
            }): React.ReactNode {
              return (
                <HStack className="mb-4 ml-4" space="md">
                  <Box className="mt-4">
                    <Checkbox
                      value={`${data.item.id}`}
                      size="md"
                      isInvalid={false}
                      isDisabled={false}
                      onChange={(isSelected) => {
                        setChecked(isSelected ? data.item.id : 0);
                      }}
                      isChecked={checked === data?.item?.id}
                    >
                      <CheckboxIndicator>
                        <CheckboxIcon as={CheckIcon} />
                      </CheckboxIndicator>
                    </Checkbox>
                  </Box>
                  <Box className="flex-1">
                    <FixedRouteItem disabled fixedRoute={data.item} />
                  </Box>
                </HStack>
              );
            }}
            queryFn={async function (lastPage: any): Promise<IFixedRoute[]> {
              try {
                const { data } =
                  await xediSupabase.tables.fixedRoutes.selectByUserIdAfterId({
                    id: lastPage,
                    filter: [
                      {
                        filter: "eq",
                        filed: "status",
                        data: IFixedRouteStatus.PENDING,
                      },
                    ],
                  });
                return data || [];
              } catch (e) {
                return [];
              }
            }}
            getLastPageNumber={function (lastData: any[]) {
              return lastData?.[lastData.length - 1]?.id;
            }}
          />
        </Box>
        <Box
          className="bg-white px-[16px] pt-4"
          style={{ paddingBottom: insets.bottom }}
        >
          <Button
            onPress={handlerMergeTripRequest}
            isDisabled={!driverRequest || !checked}
            className="h-[45px]"
          >
            <ButtonText>Xác nhận</ButtonText>
          </Button>
        </Box>
      </Box>
    )
  );
}
