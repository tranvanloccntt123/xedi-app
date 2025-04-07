import React from "react";
import { useSelector } from "react-redux";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonText } from "@/src/components/ui/button";
import type { RootState } from "@/src/store/store";
import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
import { formatMoney, unformatMoney } from "../../utils/formatMoney";
import { FormControl } from "../ui/form-control";
import { Text } from "../ui/text";
import { xediSupabase } from "../../lib/supabase";
import { HStack } from "../ui/hstack";
import { XEDI_QUERY_KEY } from "@/src/store/fetchServices/fetchServicesSlice";
import useQuery from "@/hooks/useQuery";
import AppStyles, { wrapTextStyle } from "@/src/theme/AppStyles";

const DriverTripRequestPending: React.FC<{ tripRequestId: number }> = ({
  tripRequestId,
}) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);
  const queryKey = `${XEDI_QUERY_KEY.DRIVER_TRIP_REQUEST}_${tripRequestId}`;

  const queryFn = async () => {
    try {
      const { data } =
        await xediSupabase.tables.driverTripRequest.selectRequestOrdered({
          tripRequestId: tripRequestId,
          userId: user.id,
        });
      if (data.length) {
        return data[0];
      }
      throw "Not found";
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const {
    data: driverTripRequest,
    isLoading,
    refetch,
  } = useQuery<IDriverTripRequest>({
    queryFn,
    queryKey,
  });

  const [price, setPrice] = React.useState("");

  return (
    <VStack space="lg" className="bg-xedi-card rounded-lg p-4">
      <Heading
        className="color-xedi-text"
        style={wrapTextStyle({ fontWeight: "700" }, "sm")}
      >
        Tài xế báo giá
      </Heading>
      {!!driverTripRequest && !isLoading && (
        <VStack className="md">
          <HStack className="md" space="md">
            <Text
              className="flex-1 color-xedi-placeholder"
              style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
            >
              Giá đã báo:
            </Text>
            <Text
              className="flex-1 text-right"
              style={wrapTextStyle({ fontWeight: "700" }, "2xs")}
            >
              {formatMoney(driverTripRequest.price)} VND
            </Text>
          </HStack>
        </VStack>
      )}
      {!driverTripRequest && !isLoading && (
        <VStack space="md">
          <FormControl>
            <Text
              className="mb-2 color-xedi-placeholder"
              style={wrapTextStyle({ fontWeight: "400" }, "2xs")}
            >
              Giá (VND)
            </Text>
            <Input className="border-0 bg-xedi-white" style={AppStyles.inp}>
              <InputField
                value={formatMoney(price)}
                placeholder="Nhập báo giá"
                style={wrapTextStyle({ fontWeight: "500" }, "2xs")}
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
            action="default"
            style={AppStyles.primaryBtn}
            onPress={async () => {
              await xediSupabase.tables.driverTripRequest.addWithUserId([
                {
                  price: parseFloat(price),
                  trip_request_id: tripRequestId,
                },
              ]);
              refetch();
            }}
          >
            <ButtonText style={wrapTextStyle({ fontWeight: "500" }, "2xs")}>
              Gửi báo giá
            </ButtonText>
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default DriverTripRequestPending;
