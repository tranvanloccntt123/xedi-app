import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { ITripRequest, IUser } from "@/src/types";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
import TripRequestItem from "./TripRequestItem";
import CustomerTripRequestList from "./CustomerTripRequestList";
import { BottomSheet } from "../ui/bottom-sheet";
import CustomerTripRequestBottomSheet from "./CustomerTripRequestBottomSheet";
import DriverTripRequestPending from "./DriverTripRequestPending";
import { HStack } from "../ui/hstack";

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

const TripRequestAccepted: React.FC<{
  tripRequest: ITripRequest;
  onReject?: (driverTripRequestId: number) => any;
}> = ({ tripRequest, onReject }) => {
  const driverRequest = useSelector(
    (state: RootState) => state.tripRequests.tripRequestAccepted[tripRequest.id]
  );

  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && tripRequest && user.id === tripRequest?.user_id,
    [user, tripRequest]
  );

  const isDriverAccepted = React.useMemo(
    () => user && driverRequest && user.id === driverRequest.user_id,
    [user, driverRequest]
  );

  return (
    <Box className="flex-1 bg-gray-100">
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Box className="flex-1 px-4 bg-gray-100">
            <VStack space="md">
              <Header title="Chi tiết hành trình" />
              {!!tripRequest && (
                <TripRequestItem
                  className="mx-0"
                  tripRequest={tripRequest}
                  disabled
                />
              )}
              {!isAuthor && tripRequest && user.role === "driver" && (
                <DriverTripRequestPending tripRequestId={tripRequest.id} />
              )}
              {isAuthor && (
                <CustomerTripRequestList tripRequestId={tripRequest.id} />
              )}
            </VStack>
          </Box>
        </ScrollView>
        <Box className="bg-white p-4 h-[75px]">
          <HStack space="md">
            {isDriverAccepted && (
              <Box className="flex-1">
                <Button
                  onPress={() => onReject?.(driverRequest.id)}
                  variant="outline"
                  className="h-[45px] border-error-500"
                >
                  <ButtonText className="text-error-500">Huỷ</ButtonText>
                </Button>
              </Box>
            )}
            <Box className="flex-1">
              <Button className="h-[45px]">
                <ButtonText>Nhắn tin</ButtonText>
              </Button>
            </Box>
          </HStack>
        </Box>
      </SafeAreaView>
    </Box>
  );
};

export default TripRequestAccepted;
