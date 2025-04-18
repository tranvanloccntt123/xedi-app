const APP_STRUCT = "FIXED_ROUTE_DETAIL_SCREEN";

import React from "react";
import { useSelector } from "react-redux";
import { Box } from "@/src/components/ui/box";
import { VStack } from "@/src/components/ui/vstack";
import { Button, ButtonIcon } from "@/src/components/ui/button";
import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootState } from "@/src/store/store";
import Header from "@/src/components/Header";
import { EditIcon } from "@/src/components/ui/icon";
import TripRequestItem from "./TripRequestItem";
import CustomerTripRequestList from "./CustomerTripRequestList";
import { BottomSheet } from "../ui/bottom-sheet";
import CustomerTripRequestBottomSheet from "./CustomerTripRequestBottomSheet";
import DriverTripRequestPending from "./DriverTripRequestPending";
import DriverCancelRequest from "./DriverCancelRequest";

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

const TripRequestDetailPending: React.FC<{
  tripRequest: ITripRequest;
  isRefreshing: boolean;
  onRefresh: () => any;
}> = ({ tripRequest, isRefreshing, onRefresh }) => {
  const user: IUser = useSelector((state: RootState) => state.auth.user);

  const isAuthor = React.useMemo(
    () => user && tripRequest && user.id === tripRequest?.user_id,
    [user, tripRequest]
  );

  return (
    <BottomSheet>
      <Box className="flex-1 bg-xedi-background">
        <SafeAreaView style={styles.container}>
          <ScrollView
            style={styles.container}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
            <Box className="flex-1 px-4">
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
                  <DriverTripRequestPending tripRequestId={tripRequest.id} />
                )}
                {isAuthor && (
                  <CustomerTripRequestList tripRequestId={tripRequest.id} />
                )}
              </VStack>
            </Box>
          </ScrollView>
          {!isAuthor && tripRequest && user.role === "driver" && (
            <DriverCancelRequest tripRequestId={tripRequest.id} />
          )}
        </SafeAreaView>
      </Box>
      {isAuthor && <CustomerTripRequestBottomSheet isAuthor={isAuthor} />}
    </BottomSheet>
  );
};

export default TripRequestDetailPending;
