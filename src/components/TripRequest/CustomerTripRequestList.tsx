const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { VStack } from "@/src/components/ui/vstack";
import { TouchableOpacity } from "react-native";
import { IDriverTripRequest } from "@/src/types";
import { Heading } from "@/src/components/ui/heading";
import { formatMoney } from "@/src/utils/formatMoney";
import { Text } from "@/src/components/ui/text";
import { xediSupabase } from "@/src/lib/supabase";
import { HStack } from "@/src/components/ui/hstack";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { BottomSheetContext } from "@/src/components/ui/bottom-sheet";
import { setCurrentDriverTripRequest } from "@/src/store/tripRequest/tripRequestsSlice";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchDriverTripRequestAccepted } from "@/src/store/tripRequest/tripRequestsThunk";
import { Center } from "../ui/center";
import { Button, ButtonText } from "../ui/button";

const CustomerTripRequestList: React.FC<{ tripRequestId: number }> = ({
  tripRequestId,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const { handleOpen } = React.useContext(BottomSheetContext);

  const tripRequestAccepted = useSelector(
    (state: RootState) => state.tripRequests.tripRequestAccepted[tripRequestId]
  );

  const [requestList, setRequestList] = React.useState<IDriverTripRequest[]>(
    []
  );

  const fetch = async () => {
    try {
      const res = await dispatch(
        fetchDriverTripRequestAccepted({ tripRequestId })
      ).unwrap();
      if (!res.driverTripRequest) {
        const { data } =
          await xediSupabase.tables.driverTripRequests.selectRequestOrdered({
            tripRequestId: tripRequestId,
          });
        setRequestList(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetch();
  }, [tripRequestId]);

  React.useEffect(() => {
    if (tripRequestAccepted) {
      setRequestList([]);
    }
  }, [tripRequestAccepted]);

  return (
    <VStack space="lg" className="bg-white rounded-lg p-4">
      <HStack className="mb-[24px] justify-between">
        <VStack>
          <Heading>
            {!tripRequestAccepted ? "Yêu cầu" : "Thông tin tài xế"}
          </Heading>
          {!tripRequestAccepted && (
            <Text className="text-sm text-black">
              Chọn tài xế mà bạn muốn đi
            </Text>
          )}
        </VStack>
      </HStack>
      {!!tripRequestAccepted && (
        <Center className="w-full">
          <VStack space="lg" className="justify-center item-center">
            <Avatar className="self-center w-[150px] h-[150px] bg-primary-400 rounded-full justify-center items-center">
              <AvatarFallbackText className="text-[70px]">
                {tripRequestAccepted.users?.name}
              </AvatarFallbackText>
            </Avatar>
            <VStack>
              <Text className="text-2xl font-bold text-black text-center">
                {tripRequestAccepted.users?.name}
              </Text>
              <Text className="text-xl text-center">
                {tripRequestAccepted.users?.phone}
              </Text>
              <Text className="font-[600] text-center">
                {formatMoney(tripRequestAccepted.price)} VND
              </Text>
            </VStack>
            <Button>
              <ButtonText>Nhắn tin</ButtonText>
            </Button>
          </VStack>
        </Center>
      )}
      {requestList.map((request, index) => (
        <VStack key={`${request.id}`} space="lg">
          <TouchableOpacity
            onPress={() => {
              handleOpen?.();
              dispatch(setCurrentDriverTripRequest(request));
            }}
          >
            <HStack space="lg">
              <Avatar className="w-[50px] h-[50px] bg-primary-400 rounded-full justify-center items-center">
                <AvatarFallbackText>{request.users?.name}</AvatarFallbackText>
              </Avatar>
              <VStack className="flex-1" space="sm">
                <HStack space="md">
                  <Text className="text-xl">{request.users?.name}</Text>
                  <Text className="text-xl">{request.users?.phone}</Text>
                </HStack>
                <Text className="font-bold text-black">
                  {formatMoney(request.price)} VND
                </Text>
              </VStack>
            </HStack>
          </TouchableOpacity>
        </VStack>
      ))}
    </VStack>
  );
};

export default CustomerTripRequestList;
