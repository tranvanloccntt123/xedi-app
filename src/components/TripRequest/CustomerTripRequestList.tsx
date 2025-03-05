const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useDispatch } from "react-redux";
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
import { setCurrentDriverTripRequest } from "@/src/store/tripRequestsSlice";

const CustomerTripRequestList: React.FC<{ tripRequestId: number }> = ({
  tripRequestId,
}) => {
  const dispatch = useDispatch();

  const { handleOpen } = React.useContext(BottomSheetContext);

  const [requestList, setRequestList] = React.useState<IDriverTripRequest[]>(
    []
  );

  const fetch = async () => {
    try {
      const { data } =
        await xediSupabase.tables.driverTripRequests.selectRequestOrdered({
          tripRequestId: tripRequestId,
        });
      setRequestList(data);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    fetch();
  }, [tripRequestId]);

  return (
    <VStack space="lg" className="bg-white rounded-lg p-4">
      <VStack className="mb-[24px]">
        <Heading>Yêu cầu</Heading>
        <Text className="text-sm text-black">Chọn tài xế mà bạn muốn đi</Text>
      </VStack>
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
