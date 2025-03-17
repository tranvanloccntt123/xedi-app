import React from "react";
import { useSelector } from "react-redux";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonText } from "@/src/components/ui/button";
import { IDriverTripRequest, IUser } from "@/src/types";
import type { RootState } from "@/src/store/store";
import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
import { formatMoney, unformatMoney } from "../../utils/formatMoney";
import { FormControl } from "../ui/form-control";
import { Text } from "../ui/text";
import { xediSupabase } from "../../lib/supabase";
import { HStack } from "../ui/hstack";

const DriverTripRequestPending: React.FC<{ tripRequestId: number }> = ({
  tripRequestId,
}) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const [price, setPrice] = React.useState("");
  const [driverTripRequest, setDriverTripRequest] =
    React.useState<IDriverTripRequest>();
  const [isFetching, setIsFetching] = React.useState(true);

  const fetch = async () => {
    setIsFetching(true);
    try {
      const { data } =
        await xediSupabase.tables.driverTripRequests.selectRequestOrdered({
          tripRequestId: tripRequestId,
          userId: user.id,
        });
      if (data.length) {
        setDriverTripRequest(data[0]);
      }
    } catch (e) {
      console.log(e);
      setDriverTripRequest(undefined);
    }
    setIsFetching(false);
  };

  React.useEffect(() => {
    fetch();
  }, [tripRequestId]);

  return (
    <VStack space="lg" className="bg-white rounded-lg p-4">
      <Heading>Tài xế báo giá</Heading>
      {!!driverTripRequest && !isFetching && (
        <VStack className="md">
          <HStack className="md" space="md">
            <Text className="text-lg text-gray-600 font-bold">Giá đã báo:</Text>
            <Text className="flex-1 text-right text-lg text-black">
              {formatMoney(driverTripRequest.price)} VND
            </Text>
          </HStack>
        </VStack>
      )}
      {!driverTripRequest && !isFetching && (
        <VStack space="md">
          <FormControl>
            <Text className="mb-2 text-md font-medium text-gray-700">
              Giá (VND)
            </Text>
            <Input>
              <InputField
                value={formatMoney(price)}
                onChangeText={(value) => {
                  if (!value) {
                    setPrice("");
                    return;
                  }
                  const numericValue = unformatMoney(value);
                  if (!isNaN(numericValue)) {
                    setPrice(numericValue.toString());
                  }
                  // setErrors({ ...errors, price: "" });
                }}
                keyboardType="numeric"
              />
            </Input>
          </FormControl>
          <Button
            onPress={() => {
              xediSupabase.tables.driverTripRequests.addWithUserId([
                {
                  price: parseFloat(price),
                  trip_request_id: tripRequestId,
                },
              ]);
            }}
          >
            <ButtonText>Gửi báo giá</ButtonText>
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default DriverTripRequestPending;
