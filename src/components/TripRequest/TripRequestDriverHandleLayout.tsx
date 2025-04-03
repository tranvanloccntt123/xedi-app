import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonText } from "@/src/components/ui/button";
import { ScrollView, StyleSheet } from "react-native";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import TripRequestItem from "./TripRequestItem";
import CustomerTripRequestList from "./CustomerTripRequestList";
import DriverTripRequestPending from "./DriverTripRequestPending";
import { HStack } from "../ui/hstack";
import { Divider } from "../ui/divider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

const TripRequestDriverHandleLayout: React.FC<{
  tripRequest: ITripRequest;
  onReject?: (driverTripRequestId: number) => any;
  mergeComponent?: React.ReactNode;
}> = ({ tripRequest, onReject, mergeComponent }) => {
  const insets = useSafeAreaInsets();
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
    <Box className="flex-1 bg-xedi-background">
      <Box className="px-4" style={{ paddingTop: insets.top }}>
        <Header title="Chi tiết hành trình" />
      </Box>
      <ScrollView style={styles.container}>
        <Box className="flex-1 px-4">
          <VStack space="md">
            {!!tripRequest && (
              <TripRequestItem
                className="mx-0"
                tripRequest={tripRequest}
                disabled
              />
            )}
            <Box className="px-2 bg-xedi-card">
              {!isAuthor && tripRequest && user.role === "driver" && (
                <DriverTripRequestPending tripRequestId={tripRequest.id} />
              )}
              {isAuthor && (
                <CustomerTripRequestList tripRequestId={tripRequest.id} />
              )}
              <Divider />
              {mergeComponent}
            </Box>
          </VStack>
        </Box>
      </ScrollView>
      <Box
        className="bg-white px-[16px] pt-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <HStack space="md" className="pb-4">
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
            <Button className="h-[45px] bg-xedi-primary" action="default">
              <ButtonText>Nhắn tin</ButtonText>
            </Button>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default TripRequestDriverHandleLayout;
