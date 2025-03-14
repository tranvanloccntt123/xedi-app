const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { IDriverTripRequest, ITripRequest, IUser } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
import TripRequestItem from "./TripRequestItem";
import { Heading } from "../ui/heading";
import { Input, InputField } from "../ui/input";
import { formatMoney, unformatMoney } from "../../utils/formatMoney";
import { FormControl } from "../ui/form-control";
import { Text } from "../ui/text";
import { xediSupabase } from "../../lib/supabase";
import { HStack } from "../ui/hstack";
import CustomerTripRequestList from "./CustomerTripRequestList";
import { BottomSheet } from "../ui/bottom-sheet";
import CustomerTripRequestBottomSheet from "./CustomerTripRequestBottomSheet";

const styles = StyleSheet.create({
  logo: {
    width: 50,
    height: 50,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: 500,
  },
});

const DriverTripRequest: React.FC<{ tripRequestId: number }> = ({
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
          <HStack className="md">
            <Text className="text-lg text-gray-600 font-bold">
              Giá đã báo:{" "}
            </Text>
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

const TripRequestDetailPending: React.FC<{
  tripRequest: ITripRequest;
  isRefreshing: boolean;
  onRefresh: () => any;
  onRunning: () => any;
  onFinished: () => any;
}> = ({ tripRequest, isRefreshing, onRefresh, onRunning, onFinished }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && tripRequest && user.id === tripRequest?.user_id,
    [user, tripRequest]
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-gray-100">
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <Box className="flex-1 px-4 bg-gray-100">
              <VStack space="md">
                <Header
                  title="Chi tiết hành trình"
                  rightComponent={
                    isAuthor && (
                      <Button variant="link">
                        <ButtonIcon as={EditIcon} stroke={"#000000"} />
                      </Button>
                    )
                  }
                />
                {!!tripRequest && (
                  <TripRequestItem
                    className="mx-0"
                    tripRequest={tripRequest}
                    disabled
                  />
                )}
                {!isAuthor && tripRequest && user.role === "driver" && (
                  <DriverTripRequest tripRequestId={tripRequest.id} />
                )}
                {isAuthor && (
                  <CustomerTripRequestList tripRequestId={tripRequest.id} />
                )}
              </VStack>
            </Box>
          </ScrollView>
        </SafeAreaView>
      </Box>
      {isAuthor && <CustomerTripRequestBottomSheet isAuthor={isAuthor} />}
    </BottomSheet>
  );
};

export default TripRequestDetailPending;
