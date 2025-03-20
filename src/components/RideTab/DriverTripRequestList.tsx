import React from "react";
import { Box } from "../ui/box";
import InfinityList, { InfinityListMethods } from "../InfinityList";
import { xediSupabase } from "@/src/lib/supabase";
import { Tables } from "@/src/constants";
import { IDriverTripRequest, IDriverTripRequestStatus } from "@/src/types";
import TripRequestItem from "../TripRequest/TripRequestItem";
import { Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { VStack } from "../ui/vstack";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { HStack } from "../ui/hstack";
import { Button, ButtonText } from "../ui/button";
import CloseIcon from "../icons/CloseIcon";
import AppColors from "@/src/constants/colors";

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
      <Pressable
        onPress={() =>
          router.navigate(`/trip/${driverTripRequest.trip_requests.id}/detail`)
        }
      >
        <TripRequestItem
          tripRequest={driverTripRequest.trip_requests}
          disabled
        />
      </Pressable>
    )
  );
};

const DriverTripRequestList: React.FC<{
  statusFilter?: IDriverTripRequestStatus[];
}> = ({ statusFilter }) => {
  const listRef = React.useRef<InfinityListMethods>(null);
  const [firstRender, setIsFirstRender] = React.useState<boolean>(true);
  React.useEffect(() => {
    !firstRender && listRef.current.refresh();
    setIsFirstRender(false);
  }, [statusFilter, firstRender]);

  return (
    <Box className="flex-1 py-4">
      <InfinityList
        ref={listRef}
        renderItem={function (data: {
          item: IDriverTripRequest;
          index: number;
        }): React.ReactNode {
          return (
            <Box className="mb-4">
              <RenderItem driverTripRequest={data.item} />
            </Box>
          );
        }}
        queryFn={async function (lastPage: any): Promise<any[]> {
          try {
            const { data } =
              await xediSupabase.tables.driverTripRequest.selectByUserIdBeforeDate(
                {
                  date: lastPage,
                  select: `*, ${Tables.TRIP_REQUESTS}(*)`,
                  filter: statusFilter.length === 1 && [
                    {
                      filed: "status",
                      filter: "eq",
                      data: statusFilter[0],
                    },
                  ],
                  orFilter: statusFilter.length > 1 && [
                    {
                      query: `${statusFilter
                        .map((filter) => `status.eq.${filter}`)
                        .join(",")}`,
                    },
                  ],
                }
              );
            return data as never;
          } catch (e) {
            console.log(e);
            return [];
          }
        }}
        getLastPageNumber={function (lastData: any[]) {
          return lastData?.[lastData.length - 1]?.created_at;
        }}
      />
    </Box>
  );
};

const DriverStatusButton: React.FC<{
  onPress?: () => any;
  title: string;
  isChecked;
}> = ({ title, isChecked, onPress }) => {
  return (
    <Button
      onPress={onPress}
      className={`rounded-full h-[25px] ${
        isChecked ? "border-primary-500" : "border-black"
      }`}
      variant="outline"
    >
      <CloseIcon
        size={12}
        color={isChecked ? AppColors.primary : AppColors.black}
      />
      <ButtonText
        className={`text-sm font-[400] ${
          isChecked ? "text-primary-500" : "text-black"
        }`}
      >
        {title}
      </ButtonText>
    </Button>
  );
};

const DriverTripRequest: React.FC<object> = () => {
  const [isPending, setIsPending] = React.useState<boolean>(true);
  const [isCustomerAccepted, setIsCustomerAccepted] =
    React.useState<boolean>(true);
  const [isDriverMergedTripRequest, setIsDriverMergedTripRequest] =
    React.useState<boolean>(true);
  const [isFinished, setIsFinished] = React.useState<boolean>(true);
  const listStatusSelected: IDriverTripRequestStatus[] = React.useMemo(() => {
    let _arr: IDriverTripRequestStatus[] = [];
    if (isPending) {
      _arr.push(IDriverTripRequestStatus.PENDING);
    }
    if (isCustomerAccepted) {
      _arr.push(IDriverTripRequestStatus.CUSTOMER_ACCEPT);
    }
    if (isDriverMergedTripRequest) {
      _arr.push(IDriverTripRequestStatus.DRIVER_MERGED_TRIP_REQUEST);
    }
    if (isFinished) {
      _arr.push(IDriverTripRequestStatus.FINISHED);
    }
    return _arr;
  }, [isPending, isCustomerAccepted, isDriverMergedTripRequest, isFinished]);

  return (
    <Box className="flex-1">
      <Box>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack className="h-[55px] px-4 items-center" space="sm">
            <DriverStatusButton
              title="Đang đợi"
              isChecked={isPending}
              onPress={() => setIsPending(!isPending)}
            />
            <DriverStatusButton
              title="Xác nhận"
              isChecked={isCustomerAccepted}
              onPress={() => setIsCustomerAccepted(!isCustomerAccepted)}
            />
            <DriverStatusButton
              title="Đã ghép chuyến"
              isChecked={isDriverMergedTripRequest}
              onPress={() =>
                setIsDriverMergedTripRequest(!isDriverMergedTripRequest)
              }
            />
            <DriverStatusButton
              title="Hoàn thành"
              isChecked={isFinished}
              onPress={() => setIsFinished(!isFinished)}
            />
          </HStack>
        </ScrollView>
      </Box>
      <Box className="flex-1">
        <DriverTripRequestList statusFilter={listStatusSelected} />
      </Box>
    </Box>
  );
};

export default DriverTripRequest;
